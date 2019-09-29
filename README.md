# Salesforce Lightning Web Components for Lightning Communities Example

This example project demonstrates how to create a Lightning Web Component which can be used in a Lightning Community page built with Community Builder. It addresses the following challenges:

- How to make the Lightning Web Component appear in the _Components_ panel of Community Builder?
- How to add parameters to the Lightning Web Component which can be configured in Community Builder?
- How to query an Apex controller method from the Lightning Web Component to fetch Salesforce data?
- How to include a shared JavaScript library which can be used by several components?
- How to pass a configuration parameter from the _Theme Layout_ to the shared JavaScript library?
- How to access the shared JavaScript library from the Lightning Web Component once it has been loaded?
- How to insert HTML content into a child element of the Lightning Web Component from the shared JavaScript library?
- How to communicate with a JavaScript included as global _Head Markup_ in the Lightning Community page using events?
- How to include a JavaScript as global _Head Markup_ only if a certain URL query parameter is present?

## Getting Started

In order to try this example project in your own Salesforce org please follow these steps:

1. Create a Salesforce org (Sandbox or Developer Edition).
2. Authorize Salesforce CLI to access the Salesforce org:

   ```bash
   sfdx force:auth:web:login --setdefaultusername --instanceurl https://test.salesforce.com
   ```

3. Deploy the sources from this project to the Salesforce org:

   ```bash
   sfdx force:source:deploy --sourcepath force-app
   ```

4. Create a Lightning Community in the Salesforce org. Open the Community Builder.
5. In the _Settings_ panel, go to _Theme_ - _Configure_. For the _Theme Layout_ named _Default_ change the component to _Example Theme Layout_.
6. In the _Settings_ panel, go to _Security_. For the _Content Security Policy_ change the _Script Security Level_ to allow inline scripts.
7. In the _Settings_ panel, go to _Advanced_ and click _Edit Head Markup_. Insert the following script block:

   ```html
   <script>
     const params = new URL(document.location).searchParams;
     if (params.has("external")) {
       const externalScript = document.createElement("script");
       externalScript.setAttribute(
         "src",
         "/resource/ExternalLibrary/exampleExternalLibrary.js"
       );
       document.head.appendChild(externalScript);
     }
   </script>
   ```

8. Create a page with _Community Builder_ and select an arbitrary _Content Layout_.
9. Drag and drop the _Example Component_ from the _Components_ panel to the page.
10. Adjust the parameters of the component as needed. _Hint: If the remote parameter is set to "Special" the Apex controller returns special items, otherwise it returns some default items._

## Project Structure

- See `force-app/main/default/aura/exampleThemeLayout` for the Aura component which is used as _Theme Layout_ to include the shared JavaScript library.
- See `force-app/main/default/classes` for the Apex classes used to build the server-side Apex controller which is called by the Lightning Web Component to fetch some server data.
- See `force-app/main/default/lwc/exampleComponent` for the implementation of the example Lightning Web Component.
- See `force-app/main/default/staticresources/InternalLibrary` for the _Static Resource_ containing the shared JavaScript library loaded by the _Theme Layout_.
- See `force-app/main/default/staticresources/ExternalLibrary` for the _Static Resource_ containing the external JavaScript library included as global _Head Markup_ into the page.

## Concepts

### How to make the Lightning Web Component appear in the _Components_ panel of Community Builder

The metadata descriptor of the Lightning Web Component must contain the following markup:

```xml
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata" fqn="exampleComponent">
  ...
  <isExposed>true</isExposed>
  <masterLabel>Example Component</masterLabel>
  <targets>
    <target>lightningCommunity__Page</target>
    <target>lightningCommunity__Default</target>
  </targets>
  ...
</LightningComponentBundle>
```

### How to add parameters to the Lightning Web Component which can be configured in Community Builder

First, the JavaScript class of the Lightning Web Component must declare `@api` properties for the external parameters:

```javascript
import { LightningElement, api } from "lwc";
export default class ExampleComponent extends LightningElement {
  @api configParam = "";
}
```

Second, the metadata descriptor of the Lightning Web Component must contain the following markup:

```xml
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata" fqn="exampleComponent">
  ...
  <targetConfigs>
    <targetConfig targets="lightningCommunity__Default">
      <property name="configParam" type="String" label="Configuration Parameter"
        description="Enter the configuration value." default="Example value" />
    </targetConfig>
  </targetConfigs>
  ...
</LightningComponentBundle>
```

### How to query an Apex controller method from the Lightning Web Component to fetch Salesforce data

The JavaScript class of the Lightning Web Component can make use of the `@wire` decorator to query Apex methods:

```javascript
import { LightningElement, wire } from "lwc";
import getRemoteData from "@salesforce/apex/RemoteDataController.getRemoteData";
export default class ExampleComponent extends LightningElement {
  remoteParam = "";
  @wire(getRemoteData, { queryParam: "$remoteParam" })
  remoteData;
}
```

The Apex class of the server-side controller must be annotated with `@AuraEnabled`:

```java
public with sharing class RemoteDataController {
  @AuraEnabled(cacheable = true)
  public static List<RemoteData> getRemoteData(String queryParam) {
    return new List<RemoteData>();
  }
}
```

### How to include a shared JavaScript library which can be used by several components

The JavaScript library should be uploaded as a _Static Resource_ to Salesforce (e.g. named _InternalLibrary_).

A custom _Theme Layout Component_ can be used to load the library in the Lightning Community page, making it available for all Lightning Web Components of the same namespace as well:

```html
<aura:component implements="forceCommunity:themeLayout" access="global">
  ...
  <ltng:require
    scripts="{!$Resource.InternalLibrary + '/exampleInternalLibrary.js'}"
    afterScriptsLoaded="{!c.afterScriptsLoaded}"
  />
  ...
</aura:component>
```

### How to pass a configuration parameter from the _Theme Layout_ to the shared JavaScript library

The _Theme Layout Component_ can define attributes to appear as configuration parameters in Community Builder:

```html
<aura:component implements="forceCommunity:themeLayout" access="global">
  <aura:attribute
    name="configValue"
    type="String"
    required="true"
    default="Default Value"
  />
  ...
</aura:component>
```

The parameters must be declared in the `.design` descriptor of the Aura component:

```xml
<design:component label="Example Theme Layout">
  <design:attribute name="configValue" label="Configuration Value" />
</design:component>
```

The JavaScript callback `afterScriptsLoaded` in the _Theme Layout Component_ can be used to initialize the library once the script has been loaded in the browser. Configuration parameters can be read using `component.get('v.paramName')`:

```javascript
({
  afterScriptsLoaded: function(component, event, helper) {
    window.ExampleLibrary.config({
      configValue: component.get("v.configValue")
    });
  }
});
```

### How to access the shared JavaScript library from the Lightning Web Component once it has been loaded

The trick is to defer access to the shared library inside Lightning Web Components until the library script has been loaded and initialized.

The Theme Layout Component can declare a global `Promise` which is resolved once the library is ready:

```html
<aura:component implements="forceCommunity:themeLayout" access="global">
  <aura:handler name="init" value="{!this}" action="{!c.doInit}" />
  <ltng:require
    scripts="{!$Resource.InternalLibrary + '/exampleInternalLibrary.js'}"
    afterScriptsLoaded="{!c.afterScriptsLoaded}"
  />
  ...
</aura:component>
```

```javascript
({
  doInit: function(component, event, helper) {
    window.ExampleLibrary = window.ExampleLibrary || {};
    window.ExampleLibrary.loaded = new Promise(resolve => {
      component.exampleLibraryLoaded = resolve;
    });
  },
  afterScriptsLoaded: function(component, event, helper) {
    component.exampleLibraryLoaded();
  }
});
```

Lightning Web Components on the page can wait for the promise to resolve before accessing the library:

```javascript
import { LightningElement } from "lwc";
export default class ExampleComponent extends LightningElement {
  async renderedCallback() {
    await window.ExampleLibrary.loaded;
    window.ExampleLibrary.someMethod("foo", "bar");
  }
}
```

### How to insert HTML content into a child element of the Lightning Web Component from the shared JavaScript library

The Lightning Web Component should query the child element marked as `lwc:dom="manual"` and pass it to the function of the library:

```javascript
import { LightningElement } from "lwc";
export default class ExampleComponent extends LightningElement {
  insertLibraryContent() {
    const element = this.template.querySelector(".library-content");
    window.ExampleLibrary.insertContent("someValue", element);
  }
}
```

```html
<template>
  ...
  <div lwc:dom="manual" class="library-content"></div>
  ...
</template>
```

The shared JavaScript library can generate any HTML markup and insert it into the child element:

```javascript
window.ExampleLibrary = window.ExampleLibrary || {};
window.ExampleLibrary.insertContent = (input, element) => {
  const html = `<p>Input was "${input}"</p>`;
  element.insertAdjacentHTML("beforeend", html);
};
```

_Note: You cannot insert `<script>` elements like this because Lightning Locker prevents it for security reasons!_

### How to communicate with a JavaScript included as global _Head Markup_ in the Lightning Community page using events

Communication between scripts loaded inside the Lightning Locker context (e.g. loaded in _Theme Layout Component_) and scripts loaded outside (as _Head Markup_) is really tricky because globals like `window` are not the same. Therefore, namespaces, variables and functions declared outside of the Lightning Locker context are not visible to scripts loaded inside the Lightning Locker context.

There is one approach to send messages from the Lightning Locker context to the outside world using events.

The JavaScript of a Lightning Web Component or shared library loaded in the _Theme Layout Component_ can dispatch a custom event with `bubbles: true` and `composed: true`:

```javascript
const event = new CustomEvent("custom_event", {
  bubbles: true,
  composed: true,
  detail: { foo: "bar" }
});

// Inside a Lightning Web Component:
this.dispatchEvent(event);

// Inside a shared library function having access to a DOM element:
element.dispatchEvent(event);
```

JavaScript libraries included as global _Head Markup_ can listen to such events bubbling up the DOM tree:

```javascript
document.addEventListener("custom_event", event => {
  console.info(`Received event. Foo is ${event.detail.foo}`);
});
```

### How to include a JavaScript as global _Head Markup_ only if a certain URL query parameter is present

The `<script>` element can be generated dynamically based on some criteria (e.g. presence of a certain URL query parameter):

```html
<script>
  const params = new URL(document.location).searchParams;
  if (params.has("external")) {
    const externalScript = document.createElement("script");
    externalScript.setAttribute(
      "src",
      "/resource/ExternalLibrary/exampleExternalLibrary.js"
    );
    document.head.appendChild(externalScript);
  }
</script>
```

In the example the external library is only loaded if the URL of the Lightning Community page contains the query parameter `external`, e.g. <https://somedomain.force.com/s/?external>

_Note: The script can also be loaded from any absolute URL (e.g. CDN) as long as you add it to the trusted script sources._

## Resources

This example project was built with the help of the following articles and references:

- <https://developer.salesforce.com/blogs/2019/04/lightning-web-components-in-lightning-communities.html>
- <https://trailhead.salesforce.com/en/content/learn/projects/quick-start-lightning-web-components/create-a-hello-world-lightning-web-component>
- <https://developer.salesforce.com/docs/component-library/documentation/lwc/lwc.apex>
- <https://developer.salesforce.com/docs/component-library/documentation/lwc/lwc.reference_configuration_tags>
- <https://developer.salesforce.com/docs/component-library/documentation/lwc/lwc.interop_components_css_aura>
- <https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/tokens_standard_communities.htm>

## License

[MIT](https://opensource.org/licenses/MIT)
