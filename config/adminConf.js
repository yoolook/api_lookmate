module.exports = {
    'accepted_extensions_of_image': ['jpg', 'png', 'gif'],
    'appearance_file_upload_size':  10 * 1024 * 1024,  // 10 MB upload limit
    'appearance_file_upload_count':10,
    'appearance_location': './Images',
    'appearance_thumbnail_location': './Thumbnails',
    'internet_appearance_thumbnail_location':'http://103.86.176.210:3000/Thumbnails/',
    'thumbnail_width': 200,
    'thumbnail_height':200,
    'thumbnail_quality':20,
    'profile_image_upload_size':  5 * 1024 * 1024,  // 5 MB upload limit
    'profile_image_file_count':1,
    'profile_image_location':'./ProfileImages',
    'uniqueImageCode':'lookmateImage',
    'authorizedSettingValues':["profileVisibleTo","profilePictureVisibility","strictlyAnonymous","notificationScreen","notification_sms"],
    'openCommentsLimit':1,
    'lookmate_official_unknown_user':28,
    'unknown_lookmate_username': "LookmateUser",
    'appearance_limit_home_page': 45,
    'intial_server_run_IP':"0.0.0.0",

    'FEED_APPEARANCE_TOPIC':'feed_appearance'

}