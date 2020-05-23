/* todo:Create a backend response validator (currently sending as it is from all the controllers) but
these should be controlled by this validator when sent to the user.
Currently done using "responseObject" in each request controller.

Success Requests should be in this format:
{
    //header with token
     x-auth-token:token
}
{
    returnType:success; //could be error or success.
    code:201; 
    message:String;
    <Should contain the success results here>
    realReturn:String; //should be disabled in final build.
}

Failed request should be in this format:
{
    //status
    400
}
{
    returnType:error; //could be error or success.
    code:Number;
    message:String;
    realReturn:String; //should be disabled in final build/
}
*/

function modifyResponseBody(req, res, next) {
    console.log("\n\n---reponse validator called----");
    var oldSend = res.send;
    res.send = function(data){
        // arguments[0] (or `data`) contains the response body
        arguments[0] = "modified : " + arguments[0];
        oldSend.apply(res, arguments);
    }
    next();
}
app.use(modifyResponseBody);