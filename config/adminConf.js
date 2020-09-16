module.exports = {
    'accepted_extensions_of_image': ['jpg', 'png', 'gif'],
    'appearance_file_upload_size':  1 * 1024 * 1024,  // 2 MB upload limit
    'appearance_file_upload_count':10,
    'appearance_location': './Images',
    'appearance_thumbnail_location': './Thumbnails',
    'internet_appearance_thumbnail_location':'http://10.0.2.2:3000/Thumbnails/',
    'profile_image_upload_size':  5 * 1024 * 1024,  // 5 MB upload limit
    'profile_image_file_count':1,
    'profile_image_location':'./ProfileImages',
    'uniqueImageCode':'lookmateImage',
    'authorizedSettingValues':["profileVisibleTo","profilePictureVisibility","strictlyAnonymous","notificationScreen","notification_sms"]
}