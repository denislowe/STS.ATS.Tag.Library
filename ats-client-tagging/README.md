# ats-client-tagging

## Setup

* Install dependencies with *npm*

        cd ats-client-tagging
        npm install

* Lint and package the source code by executing *gulp*

        gulp

The Javascript API file will be available in *ats-client-tagging/dist/stcats.js* OR *ats-client-tagging/dist/sctats.min.js*

## Example Usage

```html
<script type='text/javascript' id="stcTag" src='../dist/stcats.js?ats={ATS}&aid=test_app_id&applicantid=12345&action={complete|start}'></script>
```

On browser page ready event, the tag library performs the following actions:
1. Finds script tag with ID equals to "stcTag" (**NOTE: it is important not to use different ID value**) and extract the query parameters within the *src* attribute.
2. Based on the *ats* query parameter, the library loads a specific ATS implementation. Please see the next section for more information.
3. Parse the information defined in query parameters and forwards the event to STC Snowplow's collector by sending an HTTP request to the collector API endpoint.



## How to?

### Add new implementation for new ATS

1. Create a new JS file that matches the new ATS name in **ats-client-tagging/src/ats-clients/**.
2. The new class should inherits from the *BaseAts* class.
3. Override the default logic that retrieve job req ID, app ID, or applicant ID by overriding the **getReqId(), getAppId(), getApplicantId()** functions of BaseAts class.
4. Require the new class in **ats-clients/index.js**. Example:
```javascript
var atsClients = {
  'kenexa': require('./kenexa')
  ...
};
```
5. Update the script tag in the ATS
```html
<script type='text/javascript' id="stcTag" src='../dist/stcats.js?ats=kenexa'></script>

<!-- Load the tag script by providing the app ID, applicant ID, and action -->
<script type='text/javascript' id="stcTag" src='../dist/stcats.js?ats=kenexa&aid=test_app_id&applicantid=12345&action=App_Start'></script>
```
