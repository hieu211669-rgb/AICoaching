from datetime import timedelta

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import uvicorn
import shutil
import asyncio
import cloudinary
import cloudinary.uploader
import cloudinary.utils
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Local imports using absolute paths to avoid import errors in 3.11
from models import VideoModel, UserIn, UserOut, UserRole, ForgotPasswordRequest, ResetPasswordRequest, ExerciseTag, UserFavorite, WorkoutHistory
from database.mongodb import (
    get_all_videos, add_video, delete_video, get_user_by_email, create_user, db, 
    get_admin_stats, get_muscle_groups, add_exercise, get_all_exercises, 
    delete_exercise, get_exercise_by_id, update_exercise,
    add_exercise_tag, get_exercise_tags, remove_exercise_tag,
    add_user_favorite, get_user_favorites, remove_user_favorite,
    add_workout_history, get_user_workout_history, get_user_stats
)
from services.ai_service import get_ai_response
from auth_utils import get_password_hash, verify_password, create_access_token, SECRET_KEY, ALGORITHM, get_admin_user
import jwt

# Email configuration
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", SMTP_USER)

async def send_email(to_email: str, subject: str, html_content: str):
    """Send email using SMTP"""
    try:
        if not SMTP_USER or not SMTP_PASSWORD:
            print(f"WARNING: Email credentials not configured. Email not sent to {to_email}")
            return False
        
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = FROM_EMAIL
        message["To"] = to_email
        
        part = MIMEText(html_content, "html")
        message.attach(part)
        
        async with aiosmtplib.SMTP(hostname=SMTP_HOST, port=SMTP_PORT) as smtp:
            await smtp.login(SMTP_USER, SMTP_PASSWORD)
            await smtp.sendmail(FROM_EMAIL, to_email, message.as_string())
        
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False

app = FastAPI(
    title="AI Coaching API",
    description="Backend optimized for Python 3.11",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Storage configuration
UPLOAD_DIR = "static/videos"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Static file serving
app.mount("/static", StaticFiles(directory="static"), name="static")

class ChatRequest(BaseModel):
    message: str

@app.get("/")
async def root():
    return {"status": "online", "engine": "Python 3.11"}

# --- Auth Endpoints ---

@app.post("/api/auth/signup", response_model=UserOut)
async def signup(user: UserIn):
    existing_user = await get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    user_dict = user.dict()
    del user_dict["password"]
    user_dict["hashed_password"] = hashed_password
    
    new_user_id = await create_user(user_dict)
    return {**user_dict, "id": str(new_user_id)}

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/auth/login")
async def login(request: LoginRequest):
    user = await get_user_by_email(request.email)
    if not user or not verify_password(request.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(
        data={"sub": user["email"], "role": user["role"]}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"],
            "height": user.get("height"),
            "weight": user.get("weight"),
            "body_fat": user.get("body_fat"),
            "goal": user.get("goal"),
            "experience_level": user.get("experience_level"),
            "activity_level": user.get("activity_level")
        }
    }

@app.get("/api/auth/profile", response_model=UserOut)
async def get_profile(email: str):
    user = await get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    body_fat: Optional[float] = None
    goal: Optional[str] = None
    experience_level: Optional[str] = None
    activity_level: Optional[str] = None

@app.patch("/api/auth/profile")
async def update_profile(email: str, profile: ProfileUpdate):
    existing_user = await get_user_by_email(email)
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = {k: v for k, v in profile.dict().items() if v is not None}
    if not update_data:
        return {"message": "No changes requested"}
        
    await db.users.update_one(
        {"email": email},
        {"$set": update_data}
    )
    
    return {"message": "Profile updated successfully"}

@app.post("/api/auth/forgot-password")
async def forgot_password(request: ForgotPasswordRequest):
    user = await get_user_by_email(request.email)
    if not user:
        # For security, don't reveal if user exists
        return {"message": "Recovery link sent if email exists"}
    
    # Generate a short-lived reset token
    token = create_access_token(
        data={"sub": user["email"], "type": "reset"},
        expires_delta=timedelta(minutes=15)  
    )
    
    # Create reset link
    reset_link = f"http://localhost:3000/resetpw?token={token}"
    
    # Create email content
    html_content = f"""
    <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; background-color: #f5f5f5; }}
                .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; }}
                .header {{ color: #f4ffc6; background: linear-gradient(135deg, #f4ffc6 0%, #d1fc00 100%); padding: 20px; border-radius: 4px; text-align: center; }}
                .header h1 {{ color: #000; margin: 0; font-size: 24px; }}
                .content {{ margin: 20px 0; color: #333; }}
                .reset-button {{ display: inline-block; background: linear-gradient(135deg, #f4ffc6 0%, #d1fc00 100%); color: #000; padding: 12px 30px; border-radius: 4px; text-decoration: none; font-weight: bold; margin: 20px 0; }}
                .footer {{ margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px; }}
                .warning {{ color: #ff7351; font-size: 12px; margin-top: 20px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔐 Password Reset Request</h1>
                </div>
                <div class="content">
                    <p>Hi {user.get('full_name', 'User')},</p>
                    <p>We received a request to reset your password for your Volt Kinetic account. Click the button below to reset your password:</p>
                    <center>
                        <a href="{reset_link}" class="reset-button">RESET PASSWORD</a>
                    </center>
                    <p>Or copy and paste this link in your browser:</p>
                    <p><code>{reset_link}</code></p>
                    <div class="warning">
                        ⚠️ This link will expire in 15 minutes. If you didn't request a password reset, please ignore this email and make sure your account is secure.
                    </div>
                </div>
                <div class="footer">
                    <p>© 2024 Volt Kinetic. All rights reserved.</p>
                    <p>This is an automated message, please do not reply.</p>
                </div>
            </div>
        </body>
    </html>
    """
    
    # Send email
    email_sent = await send_email(
        to_email=user["email"],
        subject="🔐 Volt Kinetic - Password Reset Request",
        html_content=html_content
    )
    
    if not email_sent:
        print(f"DEBUG: Password reset link for {user['email']}: {reset_link}")
        return {"message": "Recovery link sent if email exists"}
    
    return {"message": "Recovery link sent if email exists"}

@app.post("/api/auth/reset-password")
async def reset_password(request: ResetPasswordRequest):
    try:
        payload = jwt.decode(request.token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email or payload.get("type") != "reset":
            raise HTTPException(status_code=400, detail="Invalid token")
            
        user = await get_user_by_email(email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        hashed_password = get_password_hash(request.new_password)
        await db.users.update_one(
            {"email": email},
            {"$set": {"hashed_password": hashed_password}}
        )
        
        return {"message": "Password updated successfully"}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=400, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class AdminEmailRequest(BaseModel):
    to_email: str
    subject: str
    content: str

@app.post("/api/admin/send-email")
async def admin_send_email(request: AdminEmailRequest, admin_user: dict = Depends(get_admin_user)):
    """
    Endpoint for admins to send custom emails to users.
    """
    # Pre-process content to handle line breaks safely before f-string
    formatted_content = request.content.replace('\n', '<br>')
    
    # Create email content with styling consistent with the app
    html_content = f"""
    <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; background-color: #f5f5f5; }}
                .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; }}
                .header {{ color: #000; background: linear-gradient(135deg, #f4ffc6 0%, #d1fc00 100%); padding: 20px; border-radius: 4px; text-align: center; }}
                .header h1 {{ margin: 0; font-size: 24px; }}
                .content {{ margin: 20px 0; color: #333; line-height: 1.6; }}
                .footer {{ margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Volt Kinetic Notification</h1>
                </div>
                <div class="content">
                    {formatted_content}
                </div>
                <div class="footer">
                    <p>© 2024 Volt Kinetic. All rights reserved.</p>
                    <p>This is an official communication from Volt Kinetic Admin.</p>
                </div>
            </div>
        </body>
    </html>
    """
    
    email_sent = await send_email(
        to_email=request.to_email,
        subject=request.subject,
        html_content=html_content
    )
    
    if not email_sent:
        raise HTTPException(status_code=500, detail="Failed to send email")
    
    return {"message": "Email sent successfully"}

@app.get("/api/admin/stats")
async def fetch_admin_stats(admin_user: dict = Depends(get_admin_user)):
    """
    Endpoint for admins to get system-wide statistics.
    """
    try:
        return await get_admin_stats()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/muscle-groups")
async def fetch_muscle_groups_admin(admin_user: dict = Depends(get_admin_user)):
    """
    Endpoint to get all muscle groups (admin).
    """
    try:
        return await get_muscle_groups()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/muscle-groups")
async def fetch_muscle_groups():
    """
    Endpoint to get all muscle groups for users.
    """
    try:
        return await get_muscle_groups()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class ExerciseCreate(BaseModel):
    exerciseName: str
    exerciseType: str
    equipment: List[str]
    targetMuscle: List[str]
    estBurn: str
    set_reps: str
    skillLevel: str
    referenceVisual: str
    biomechanicalFocus: str
    stabillityRequirement: str
    rangeOfMotion: str
    timeStamp: str
    views: Optional[int] = None

@app.post("/api/admin/exercises")
async def create_new_exercise(exercise: ExerciseCreate, admin_user: dict = Depends(get_admin_user)):
    """
    Endpoint for admins to create a new exercise.
    """
    try:
        exercise_data = exercise.dict()
        if exercise_data.get('views') is None:
            exercise_data['views'] = 0
        new_id = await add_exercise(exercise_data)
        return {"message": "Exercise created successfully", "id": str(new_id)}
    except Exception as e:
        print(f"Error creating exercise: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/exercises")
async def fetch_all_exercises_public():
    """
    Endpoint for users to fetch all exercises.
    """
    try:
        return await get_all_exercises()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/exercises")
async def fetch_all_exercises(admin_user: dict = Depends(get_admin_user)):
    """
    Endpoint for admins to fetch all exercises.
    """
    try:
        return await get_all_exercises()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/exercises/{exercise_id}")
async def fetch_exercise(exercise_id: str, admin_user: dict = Depends(get_admin_user)):
    """
    Endpoint for admins to fetch a single exercise.
    """
    try:
        exercise = await get_exercise_by_id(exercise_id)
        if not exercise:
            raise HTTPException(status_code=404, detail="Exercise not found")
        return exercise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/admin/exercises/{exercise_id}")
async def modify_exercise(exercise_id: str, exercise: ExerciseCreate):
    """
    Endpoint for admins to update an exercise.
    """
    try:
        exercise_data = {k: v for k, v in exercise.dict().items() if v is not None}
        success = await update_exercise(exercise_id, exercise_data)
        if success:
            return {"message": "Exercise updated successfully"}
        else:
            raise HTTPException(status_code=404, detail="Exercise not found or no changes made")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/admin/exercises/{exercise_id}")
async def remove_exercise(exercise_id: str):
    """
    Endpoint for admins to delete an exercise.
    """
    try:
        success = await delete_exercise(exercise_id)
        if success:
            return {"message": "Exercise deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Exercise not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Exercise Tag Endpoints ---

@app.post("/api/admin/exercise-tags")
async def add_tag_to_exercise(tag_data: ExerciseTag):
    """
    Endpoint to link a tag to an exercise.
    """
    try:
        success = await add_exercise_tag(tag_data.exercise_id, tag_data.tag_id)
        if success:
            return {"message": "Tag linked to exercise successfully"}
        else:
            raise HTTPException(status_code=400, detail="Failed to link tag")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/exercises/{exercise_id}/tags")
async def fetch_exercise_tags(exercise_id: str):
    """
    Endpoint to get all tag IDs for a specific exercise.
    """
    try:
        tags = await get_exercise_tags(exercise_id)
        return {"exercise_id": exercise_id, "tags": tags}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/admin/exercise-tags")
async def remove_tag_from_exercise(exercise_id: str, tag_id: str):
    """
    Endpoint to remove a link between an exercise and a tag.
    """
    try:
        success = await remove_exercise_tag(exercise_id, tag_id)
        if success:
            return {"message": "Tag unlinked from exercise successfully"}
        else:
            raise HTTPException(status_code=404, detail="Link not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- User Favorite Endpoints ---

@app.post("/api/user/favorites")
async def add_favorite(favorite_data: UserFavorite):
    """
    Endpoint for users to favorite an exercise.
    """
    try:
        success = await add_user_favorite(favorite_data.user_id, favorite_data.exercise_id)
        if success:
            return {"message": "Exercise added to favorites"}
        else:
            raise HTTPException(status_code=400, detail="Failed to add favorite")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/user/favorites/{user_id}")
async def fetch_user_favorites(user_id: str):
    """
    Endpoint to get all favorite exercise IDs for a user.
    """
    try:
        favorites = await get_user_favorites(user_id)
        return {"user_id": user_id, "favorites": favorites}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/user/favorites")
async def remove_favorite(user_id: str, exercise_id: str):
    """
    Endpoint to remove an exercise from user favorites.
    """
    try:
        success = await remove_user_favorite(user_id, exercise_id)
        if success:
            return {"message": "Exercise removed from favorites"}
        else:
            raise HTTPException(status_code=404, detail="Favorite not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Workout History Endpoints ---

@app.post("/api/user/workout-history")
async def create_workout_history(history: WorkoutHistory):
    """
    Endpoint to record a completed workout session.
    """
    try:
        history_data = history.dict(by_alias=True, exclude={"id"})
        new_id = await add_workout_history(history_data)
        return {"message": "Workout history recorded", "id": str(new_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/user/workout-history/{user_id}")
async def fetch_workout_history(user_id: str):
    """
    Endpoint to get workout history for a specific user.
    """
    try:
        histories = await get_user_workout_history(user_id)
        return {"user_id": user_id, "history": histories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/user/stats/{user_id}")
async def fetch_user_stats(user_id: str):
    """
    Endpoint to get weekly volume and streak for a user.
    """
    try:
        return await get_user_stats(user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """
    Endpoint for admins to upload an image to Cloudinary.
    """
    try:
        if not (os.getenv('CLOUDINARY_URL') or os.getenv('CLOUDINARY_API_KEY')):
            raise HTTPException(status_code=500, detail="Cloudinary not configured")
        
        cloudinary.config(secure=True)
        
        # Ensure file pointer at start
        try:
            file.file.seek(0)
        except Exception:
            pass

        upload_result = cloudinary.uploader.upload(
            file.file,
            folder='exercise_images',
            public_id=os.path.splitext(file.filename)[0]
        )

        return {"url": upload_result.get('secure_url')}
    except Exception as e:
        print(f"Error uploading image: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- Video Endpoints ---

@app.get("/api/videos")
async def fetch_videos():
    try:
        return await get_all_videos()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/videos/upload")
async def upload_video(
    file: UploadFile = File(...),
    title: str = Form(...),
    intensity: str = Form(...),
    focus: str = Form(...),
    duration: str = Form("00:00")
):
    try:
        # Upload to Cloudinary instead of saving locally
        # Require Cloudinary credentials via CLOUDINARY_URL or individual env vars
        if not (os.getenv('CLOUDINARY_URL') or os.getenv('CLOUDINARY_API_KEY')):
            raise HTTPException(status_code=500, detail="Cloudinary not configured. Set CLOUDINARY_URL or CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET in environment.")
        cloudinary.config(secure=True)

        # Ensure file pointer at start
        try:
            file.file.seek(0)
        except Exception:
            pass

        # Upload video to Cloudinary using upload_large for better handling of larger files
        upload_result = cloudinary.uploader.upload_large(
            file.file,
            resource_type='video',
            folder='coachai_videos',
            public_id=os.path.splitext(file.filename)[0],
            chunk_size=6000000  # 6MB chunks
        )

        # Construct thumbnail URL (first frame) using Cloudinary URL helper
        try:
            thumb_url, _ = cloudinary.utils.cloudinary_url(
                upload_result.get('public_id'),
                resource_type='video',
                format='jpg',
                transformation=[{"start_offset": '1', "width": 640, "height": 360, "crop": "fill"}]
            )
        except Exception:
            thumb_url = upload_result.get('secure_url')

        video_data = {
            "title": title,
            "url": upload_result.get('secure_url'),
            "thumbnail": thumb_url,
            "duration": duration,
            "intensity": intensity,
            "focus": focus
        }

        new_id = await add_video(video_data)

        return {
            "message": "Upload successful",
            "id": str(new_id),
            "url": video_data["url"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server Error: {str(e)}")


class VideoRegister(BaseModel):
    title: str
    url: str
    thumbnail: str
    duration: str
    intensity: str
    focus: str


@app.post("/api/videos/register")
async def register_video(video: VideoRegister):
    try:
        video_data = video.dict()
        new_id = await add_video(video_data)
        return {"message": "Registered", "id": str(new_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/videos/{video_id}")
async def remove_video(video_id: str):
    try:
        success = await delete_video(video_id)
        if success:
            return {"message": "Video deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Video not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # Calls the updated async ai_service
        response = await get_ai_response(request.message)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # Standard uvicorn run for 3.11
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
