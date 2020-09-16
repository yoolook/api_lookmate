/* 
@Description: Create a message 
@byUser: User who initiated a event on which notification is triggered.
@mode: Current modes are RATE or COMMENT
@optional: Object which include other params, currently only.{picture:pictureURL,appearanceid:Apprearance_id....}
@data: Again an object which is having a data if  required to send in notification
*/
exports.notificationMessage = function(byUser,mode,optional,data){
    return {
        //todo: add image thumbnail and update message format.
        notification: {
            title: `Lookmate: ${byUser} has just ${mode=='COMMENT'?'commented on':'rated'} your photo.`,
            body: `Check your new commnent on your photo.`,
            image:optional.picture,
            showWhenInForeground: "true"
        },
        /* android: {
            notification: {
              image: optional.picture
            }
        }, */
        data: {
            appearance_id:optional.appearanceid.toString()
        }
        //token: response.user.registration_id
    };
}