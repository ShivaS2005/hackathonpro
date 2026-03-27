# Testing Guide - Employee Data Storage

## Issues Fixed

1. ✅ **Authentication Response Bug**: Changed `id` to `_id` in login/signup responses
   - Backend now returns `_id` which matches MongoDB ObjectId field
   - Frontend localStorage now correctly stores `user._id`

2. ✅ **User Data Validation**: Added checks in EmployeeList and TaskManager
   - Validates user data exists in localStorage before API calls
   - Shows helpful error messages if user data is missing
   - Checks for valid `_id` before making requests

3. ✅ **API Request Headers**: All API calls now properly send user ID
   - Employee POST requests include `userId` and `employerId`
   - Task POST requests include `assignedBy` as user ID

## Testing Steps

### 1. Start Both Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Should show: "Connected to MongoDB" and "Server running on port 5000"

# Terminal 2 - Frontend  
cd frontend
npm run dev
# Should show: "VITE v... ready in ... ms"
```

### 2. Test Signup Flow
1. Go to `http://localhost:5173`
2. Click **Employer** button
3. Click **Sign Up**
4. Fill in:
   - Full Name: `John Smith`
   - Email: `john@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
5. Click **Sign Up** button
6. Click **OK** on success message

**Expected Result:**
- Redirected to Employer Dashboard
- No "undefined" errors in console
- User data stored in localStorage with `_id` field

### 3. Test Adding Employee
1. Click **Employees** tab in dashboard
2. Click **+ Add Employee** button
3. Fill in the form:
   - Employee Name: `Alice Johnson`
   - Employee ID: `EMP001`
   - Designation: `Software Engineer`
   - Email: `alice@example.com`
   - Phone: `9876543210`
4. Click **Add** button

**Expected Result:**
- No error messages displayed
- Employee appears in the table below
- No 500 errors in console
- Data visible in MongoDB Atlas

### 4. Test Adding Task
1. Click **Tasks** tab (for Employer Dashboard, use Tasks tab)
2. Click **+ Assign Task** button
3. Fill in the form:
   - Task Name: `Complete UI Design`
   - Description: `Design the dashboard homepage`
   - Due Date: Select any future date
   - Category: `Urgent`
   - Employee: Select from dropdown (e.g., `Alice Johnson`)
4. Click **Create Task** button

**Expected Result:**
- Task card appears below
- No error messages
- Employee name displays correctly
- Data saved to database

### 5. Verify in MongoDB Atlas
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Login and navigate to your cluster
3. Click **Collections** under the **hackathon** database
4. Verify you can see:
   - **employees** collection with the employee data
   - **tasks** collection with the task data

### 6. Test Data Persistence
1. Refresh the page (`Ctrl + R`)
2. You should see employees and tasks still displayed
3. This confirms data is persisted in the database

## Debugging Checklist

If you encounter issues:

- [ ] Backend is running on port 5000
- [ ] Frontend is running on port 5173
- [ ] MongoDB connection string is correct in `.env`
- [ ] User logged in successfully (check localStorage in DevTools)
- [ ] `user._id` exists in localStorage (not `user.id`)
- [ ] No CORS errors in console
- [ ] Database collections created in MongoDB

## Common Issues & Solutions

### Issue: "employerId=undefined"
**Cause:** User data not in localStorage
**Solution:** 
- Clear localStorage and login again
- Check that auth response includes `_id` field
- Verify user was saved to MongoDB successfully

### Issue: "Missing required fields"
**Cause:** Required field missing from request body
**Solution:**
- Check all form inputs are filled
- Verify `userId` and `employerId` are being sent
- Check browser console for exact error message

### Issue: "Failed to load resource: 500 error"
**Cause:** Backend validation failed
**Solution:**
- Check server console for detailed error message
- Ensure all required fields are in request body
- Verify MongoDB connection is working

### Issue: Data appears but disappears on refresh
**Cause:** Data saved to localStorage, not database
**Solution:**
- Check that API call returned 201 status
- Verify MongoDB collections exist
- Check server logs for save errors

## Success Indicators

✅ Employees can be added via form
✅ Employee data persists after page refresh
✅ Tasks can be assigned to employees
✅ Task data appears immediately in UI
✅ No errors in browser console
✅ Data visible in MongoDB Atlas
✅ Dropdown shows available employees for task assignment

