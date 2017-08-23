package com.james.neeonn;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaInterface;
import android.util.Log;
import android.net.Uri;
import java.io.File;
import android.os.Environment;
import android.content.Intent;
import android.media.MediaScannerConnection;
import android.content.Context;
import org.json.JSONArray;
import org.json.JSONException;


public class ScanMediaFile extends CordovaPlugin {

    @Override
	public boolean execute(final String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException
    {
        String filePath = args.getString(0);

        Log.d("Call", "Scanning2");
		Log.d("Call", filePath);
		
		File dir = Environment.getExternalStorageDirectory();
		File myFile = new File(dir, filePath);
		
		Context context = this.cordova.getActivity().getApplicationContext();
		context.sendBroadcast(new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE, Uri.fromFile(myFile)));
		
        
        //MediaScannerConnection.scanFile(context, new String[]{ filePath },
        //                                null, new MediaScannerConnection.OnScanCompletedListener()
        //{
        //    public void onScanCompleted(String path, Uri uri)
        //    {
        //        Log.d("Call", "Scan completed");
        //        callbackContext.success("ok");
        //    }
        //});
		Log.d("Call", "Scan completed");
		callbackContext.success("ok");
        return true;
	}
}
