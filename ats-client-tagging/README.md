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
<script type='text/javascript' id="stcTag" src='../dist/stcats.js?ats={ATS}&aid=test-denny&applicantid=12345'></script>
```

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
<script type='text/javascript' id="stcTag" src='../dist/stcats.js?ats=new-ats'></script>
```
