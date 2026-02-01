# StreamGiant Admin Panel

## 🔐 Access

### Admin Dashboard
- **URL:** http://localhost:3000/admin
- **Password:** `admin123`

### Upload Page
- **URL:** http://localhost:3000/admin/upload
- **Password:** `admin123` (same as dashboard)

## 📋 Features

### 1. Dashboard (`/admin`)
- View platform statistics (videos, views, users, storage)
- Quick access to upload, manage, and analytics
- Recent activity feed
- Session-based authentication

### 2. Upload Page (`/admin/upload`)

#### Video Upload
- Drag & drop or click to upload video files
- Supported formats: MP4, MOV, AVI
- Maximum file size: 5GB
- File preview with name and size

#### Thumbnail Upload
- Drag & drop or click to upload image
- Supported formats: PNG, JPG
- Recommended resolution: 1920x1080
- Live image preview

#### Content Metadata
- **Category:** Movie, TV Show, or Documentary
- **Title:** Content title (required)
- **Description:** Detailed description (required)
- **Genre:** e.g., Action, Drama, Comedy (required)
- **Release Year:** Year of release (required)
- **Duration:** e.g., 2h 15m (optional)
- **Rating:** e.g., PG-13, R (optional)

## 🔒 Security

The admin panel uses session-based authentication:
- Password is required on first access
- Session persists until logout or browser close
- Logout button available in top-right corner

**Default Password:** `admin123`

### Changing the Password

To change the admin password, edit the file:
`src/components/admin-auth.tsx`

Find this line:
```tsx
if (password === "admin123") {
```

Replace `"admin123"` with your desired password.

## 🚀 Usage

1. Navigate to http://localhost:3000/admin
2. Enter password: `admin123`
3. Click "Login"
4. Click "Upload Content" or navigate to `/admin/upload`
5. Fill in the form:
   - Select category
   - Enter title and description
   - Add genre, year, etc.
   - Upload video file
   - Upload thumbnail image (optional but recommended)
6. Click "Upload Content"
7. Wait for success confirmation
8. Form will reset automatically

## 📝 Notes

- Currently uses client-side simulation for uploads
- In production, connect to actual storage (AWS S3, Firebase, etc.)
- Video files are validated but not actually stored
- Success message appears after simulated 2-second upload
- All form data is logged to console for development

## 🔄 Next Steps

To make this production-ready:

1. **Backend Integration**
   - Set up API routes in Next.js
   - Connect to cloud storage (AWS S3, Cloudflare R2, etc.)
   - Implement actual file upload logic

2. **Database**
   - Store metadata in database (PostgreSQL, MongoDB, etc.)
   - Link video URLs with metadata

3. **Enhanced Security**
   - Implement proper authentication (NextAuth, Auth0, etc.)
   - Add role-based access control
   - Use environment variables for credentials

4. **Additional Features**
   - Content management (edit/delete)
   - Bulk upload
   - Upload progress tracking
   - Video transcoding
   - CDN integration
