import os
import certifi
import math
from datetime import date, datetime, timezone
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Tải biến môi trường
load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")

# Khởi tạo client - Sử dụng certifi để cung cấp chứng chỉ CA (sửa lỗi SSL handshake)
client = AsyncIOMotorClient(
    MONGODB_URL,
    serverSelectionTimeoutMS=10000,
    tlsCAFile=certifi.where()
)

# Khai báo tên database cụ thể
db = client["coachai_db"]

def serialize_mongo_value(value):
    if isinstance(value, ObjectId):
        return str(value)
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, float) and not math.isfinite(value):
        return None
    if isinstance(value, list):
        return [serialize_mongo_value(item) for item in value]
    if isinstance(value, dict):
        serialized = {}
        for key, item in value.items():
            serialized_key = "id" if key == "_id" else key
            serialized[serialized_key] = serialize_mongo_value(item)
        return serialized
    return value

async def get_all_videos():
    try:
        videos = await db.videos.find().to_list(100)
        return [serialize_mongo_value(video) for video in videos]
    except Exception as e:
        print(f"❌ Lỗi lấy video: {e}")
        return []

async def add_video(video_data):
    try:
        # Kiểm tra nhanh kết nối
        await client.admin.command('ping')
        result = await db.videos.insert_one(video_data)
        print(f"✅ Thành công: Đã lưu vào MongoDB Atlas (ID: {result.inserted_id})")
        return str(result.inserted_id)
    except Exception as e:
        print(f"❌ Lỗi ghi dữ liệu: {e}")
        raise e

async def delete_video(video_id: str):
    try:
        from bson import ObjectId
        result = await db.videos.delete_one({"_id": ObjectId(video_id)})
        return result.deleted_count > 0
    except Exception as e:
        print(f"❌ Lỗi xóa video: {e}")
        raise e

async def get_user_by_email(email: str):
    try:
        user = await db.users.find_one({"email": email})
        if user:
            user["id"] = str(user["_id"])
        return user
    except Exception as e:
        print(f"❌ Lỗi lấy user: {e}")
        return None

async def create_user(user_data: dict):
    try:
        result = await db.users.insert_one(user_data)
        return str(result.inserted_id)
    except Exception as e:
        print(f"❌ Lỗi tạo user: {e}")
        raise e

async def add_exercise(exercise_data: dict):
    try:
        # exercise_data should include: exerciseName, exerciseType, equipment, 
        # targetMuscle, estBurn, set_reps, skillLevel, referenceVisual, 
        # biomechanicalFocus, stabillityRequirement, rangeOfMotion, timeStamp
        result = await db.exercises.insert_one(exercise_data)
        print(f"✅ Thành công: Đã lưu bài tập vào MongoDB Atlas (ID: {result.inserted_id})")
        return str(result.inserted_id)
    except Exception as e:
        print(f"❌ Lỗi ghi dữ liệu bài tập: {e}")
        raise e

async def get_all_exercises():
    try:
        exercises = await db.exercises.find().to_list(100)
        for ex in exercises:
            if "_id" in ex:
                ex["id"] = str(ex.pop("_id"))
        return exercises
    except Exception as e:
        print(f"❌ Lỗi lấy danh sách bài tập: {e}")
        return []

async def get_exercise_by_id(exercise_id: str):
    try:
        from bson import ObjectId
        ex = await db.exercises.find_one({"_id": ObjectId(exercise_id)})
        if ex:
            ex["id"] = str(ex.pop("_id"))
        return ex
    except Exception as e:
        print(f"❌ Lỗi lấy bài tập: {e}")
        return None

async def update_exercise(exercise_id: str, exercise_data: dict):
    try:
        from bson import ObjectId
        result = await db.exercises.update_one(
            {"_id": ObjectId(exercise_id)},
            {"$set": exercise_data}
        )
        return result.modified_count > 0
    except Exception as e:
        print(f"❌ Lỗi cập nhật bài tập: {e}")
        raise e

async def delete_exercise(exercise_id: str):
    try:
        from bson import ObjectId
        result = await db.exercises.delete_one({"_id": ObjectId(exercise_id)})
        return result.deleted_count > 0
    except Exception as e:
        print(f"❌ Lỗi xóa bài tập: {e}")
        raise e

async def get_muscle_groups():
    try:
        # Sử dụng Aggregation để đếm số bài tập của tất cả nhóm cơ trong 1 lần truy vấn
        pipeline = [
            {
                "$project": {
                    "id": {"$toString": "$_id"},
                    "name": 1,
                    "image": 1,
                    "featured": 1,
                    "exercise_count":1
                }
            }
        ]
        groups = await db.muscle_groups.aggregate(pipeline).to_list(100)
        return groups
    except Exception as e:
        print(f"❌ Lỗi lấy nhóm cơ: {e}")
        return []

async def get_admin_stats():
    try:
        total_videos = await db.videos.count_documents({})
        total_users = await db.users.count_documents({})
        
        # Get count by intensity as categories
        pipeline = [
            {"$group": {"_id": "$intensity", "count": {"$sum": 1}}}
        ]
        categories_cursor = db.videos.aggregate(pipeline)
        categories = await categories_cursor.to_list(length=100)
        
        return {
            "total_videos": total_videos,
            "total_users": total_users,
            "categories_count": len(categories)
        }
    except Exception as e:
        print(f"❌ Lỗi lấy stats: {e}")
        return {
            "total_videos": 0, 
            "total_users": 0, 
            "categories_count": 0
        }

async def add_exercise_tag(exercise_id: str, tag_id: str):
    try:
        # We store them as strings to keep it simple, or we could use ObjectId if preferred.
        # Using strings for exercise_id and tag_id to match common practice when passing from frontend.
        await db.exercise_tags.update_one(
            {"exercise_id": exercise_id, "tag_id": tag_id},
            {"$set": {"exercise_id": exercise_id, "tag_id": tag_id}},
            upsert=True
        )
        return True
    except Exception as e:
        print(f"❌ Lỗi thêm tag cho bài tập: {e}")
        raise e

async def get_exercise_tags(exercise_id: str):
    try:
        tags = await db.exercise_tags.find({"exercise_id": exercise_id}).to_list(100)
        # Return list of tag_ids
        return [t["tag_id"] for t in tags]
    except Exception as e:
        print(f"❌ Lỗi lấy tags của bài tập: {e}")
        return []

async def remove_exercise_tag(exercise_id: str, tag_id: str):
    try:
        result = await db.exercise_tags.delete_one({"exercise_id": exercise_id, "tag_id": tag_id})
        return result.deleted_count > 0
    except Exception as e:
        print(f"❌ Lỗi xóa tag khỏi bài tập: {e}")
        raise e

async def add_user_favorite(user_id: str, exercise_id: str):
    try:
        from datetime import datetime
        await db.user_favorites.update_one(
            {"user_id": user_id, "exercise_id": exercise_id},
            {"$set": {"user_id": user_id, "exercise_id": exercise_id, "created_at": datetime.now()}},
            upsert=True
        )
        return True
    except Exception as e:
        print(f"❌ Lỗi thêm bài tập yêu thích: {e}")
        raise e

async def get_user_favorites(user_id: str):
    try:
        favorites = await db.user_favorites.find({"user_id": user_id}).to_list(100)
        # Return list of exercise_ids
        return [f["exercise_id"] for f in favorites]
    except Exception as e:
        print(f"❌ Lỗi lấy danh sách yêu thích: {e}")
        return []

async def remove_user_favorite(user_id: str, exercise_id: str):
    try:
        result = await db.user_favorites.delete_one({"user_id": user_id, "exercise_id": exercise_id})
        return result.deleted_count > 0
    except Exception as e:
        print(f"❌ Lỗi xóa bài tập yêu thích: {e}")
        raise e

async def add_workout_history(history_data: dict):
    try:
        result = await db.workout_histories.insert_one(history_data)
        return str(result.inserted_id)
    except Exception as e:
        print(f"❌ Lỗi thêm lịch sử tập luyện: {e}")
        raise e

def user_id_query(user_id: str):
    user_ids = [user_id]
    if ObjectId.is_valid(user_id):
        user_ids.append(ObjectId(user_id))
    return {"user_id": {"$in": user_ids}}

def parse_completed_at(value):
    if isinstance(value, datetime):
        parsed = value
    elif isinstance(value, str):
        try:
            parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
        except ValueError:
            return None
    else:
        return None

    if parsed.tzinfo:
        return parsed.astimezone(timezone.utc).replace(tzinfo=None)
    return parsed

async def get_workout_histories_for_user(user_id: str, limit: int = 1000):
    query = user_id_query(user_id)
    histories = await db.workout_histories.find(query).sort("completed_at", -1).to_list(limit)
    if histories:
        return histories
    return await db.workout_history.find(query).sort("completed_at", -1).to_list(limit)

async def get_user_workout_history(user_id: str):
    try:
        histories = await get_workout_histories_for_user(user_id, 100)
        return [serialize_mongo_value(history) for history in histories]
    except Exception as e:
        print(f"❌ Lỗi lấy lịch sử tập luyện: {e}")
        return []

async def get_user_stats(user_id: str):
    try:
        from datetime import datetime, timedelta
        
        seven_days_ago = datetime.now() - timedelta(days=7)
        all_histories = await get_workout_histories_for_user(user_id, 1000)

        if not all_histories:
            return {"weekly_volume": 0, "daily_volumes": [0]*7, "streak": 0}
        
        total_volume = 0
        daily_volumes = [0] * 7 # [6 days ago, ..., today]
        today = datetime.now().date()
        workout_dates = []
        
        for h in all_histories:
            completed_at = parse_completed_at(h.get("completed_at"))
            if not completed_at:
                continue

            workout_dates.append(completed_at.date())
            if completed_at < seven_days_ago:
                continue

            vol = h.get("weight_used", 0) * h.get("completed_sets", 0) * h.get("completed_reps", 0)
            total_volume += vol
            
            # Group by day for the chart
            h_date = completed_at.date()
            days_diff = (today - h_date).days
            if 0 <= days_diff < 7:
                daily_volumes[6 - days_diff] += vol
        
        if not workout_dates:
            return {"weekly_volume": 0, "daily_volumes": [0]*7, "streak": 0}
            
        unique_dates = sorted(list(set(workout_dates)), reverse=True)
        
        streak = 0
        current_date = today
        
        # Check if they worked out today or yesterday to keep streak alive
        if unique_dates[0] < today - timedelta(days=1):
            streak = 0
        else:
            # If the most recent workout is today or yesterday, start counting
            if unique_dates[0] == today or unique_dates[0] == today - timedelta(days=1):
                streak = 1
                last_workout_date = unique_dates[0]
                for next_date in unique_dates[1:]:
                    if last_workout_date - timedelta(days=1) == next_date:
                        streak += 1
                        last_workout_date = next_date
                    else:
                        break
        
        return {
            "weekly_volume": total_volume,
            "daily_volumes": daily_volumes,
            "streak": streak
        }
    except Exception as e:
        print(f"❌ Lỗi tính stats: {e}")
        return {"weekly_volume": 0, "daily_volumes": [0]*7, "streak": 0}
