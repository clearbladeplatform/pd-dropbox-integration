// Can pass in parameter with filename
PARAMETERIZED = false
COLLECTION = "dropbox_resources"
/**
 * Fetch the contents of an access-controlled Dropbox Resource
 * 
 * @param {string} filename - filename associated with a row in dropbox_resources collection
 * @returns {string} content - contents of Dropbox hosted file
 */
function FetchDropboxAsset(req, resp){
    // This is associated with a configured row in `dropbox_resources` collection
    filename = "dropbox.txt"
    if(PARAMETERIZED){
        filename = req.params.filename
    }
    ClearBlade.init({request:req})
    ClearBlade.Query({collectionName:COLLECTION}).equalTo("filename", filename).fetch(getFile)
    
    function getFile(err, data){
        if(err ||  ! data || data.TOTAL !== 1){
            resp.error("Failed to find filename: " + filename + " due to error: " + JSON.stringify(data))
        }
        var url = data.DATA[0].url
        var http = Requests()
        http.get({url}, complete)
    }
    
    
    function complete(err, data){
        if(err ){
            resp.error("Failed to GET Dropbox URL: " + JSON.stringify(err))
        }
        resp.success(data)
    }
}