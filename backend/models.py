from pydantic import BaseModel, Field, GetCoreSchemaHandler, GetJsonSchemaHandler
from pydantic_core import core_schema
from datetime import datetime
from typing import Literal, Optional, Any, List
from bson import ObjectId

# Helper to handle MongoDB ObjectId in Pydantic V2
class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type: Any, handler: GetCoreSchemaHandler
    ) -> core_schema.CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(cls.validate),
                ]),
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x), when_used='always'
            ),
        )

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(
        cls, core_schema: core_schema.CoreSchema, handler: GetJsonSchemaHandler
    ):
        return handler(core_schema)

class VideoModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    title: str
    url: str
    thumbnail: str
    duration: str
    intensity: Literal['Low', 'Medium', 'High', 'Expert']
    focus: str
    date: datetime = Field(default_factory=datetime.now)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_schema_extra = {
            "example": {
                "title": "Bí Mật Kinh Điển GYMER Thập Niên 90",
                "url": "/videos/video1.mp4",
                "thumbnail": "https://example.com/thumb.jpg",
                "duration": "15:42",
                "intensity": "High",
                "focus": "Full Body",
            }
        }

class UserRole(str):
    ADMIN = "admin"
    USER = "user"

class UserBase(BaseModel):
    email: str
    full_name: str
    role: str = "user"
    height: Optional[float] = None
    weight: Optional[float] = None
    body_fat: Optional[float] = None
    goal: Optional[str] = None
    experience_level: Optional[str] = None
    activity_level: Optional[str] = None

class UserIn(UserBase):
    password: str

class UserOut(UserBase):
    id: str

class UserDB(UserBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    hashed_password: str

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class ExerciseTag(BaseModel):
    exercise_id: str
    tag_id: str

    class Config:
        json_schema_extra = {
            "example": {
                "exercise_id": "60d5ecb8b392d40015f8e651",
                "tag_id": "60d5ecb8b392d40015f8e652"
            }
        }

class UserFavorite(BaseModel):
    user_id: str
    exercise_id: str
    created_at: datetime = Field(default_factory=datetime.now)

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user_email_or_id",
                "exercise_id": "60d5ecb8b392d40015f8e651"
            }
        }

class WorkoutHistory(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    exercise_id: str
    completed_sets: int
    completed_reps: int
    weight_used: float
    calories_burned: int
    completed_at: datetime = Field(default_factory=datetime.now)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_schema_extra = {
            "example": {
                "user_id": "user@example.com",
                "exercise_id": "60d5ecb8b392d40015f8e651",
                "completed_sets": 3,
                "completed_reps": 12,
                "weight_used": 40.5,
                "calories_burned": 150
            }
        }
