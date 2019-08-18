# Salesforce Lightning Web Components for Lightning Communities Example

This example project demonstrates how to create a Lightning Web Component which can be used in a page built with Community Builder. The component displays a text which can be set by the editor and fetches data from a remote Apex controller method.

## Getting Started

In order to try this example project in your own Salesforce org please follow these steps:

1. Create a Salesforce org (Sandbox or Developer Edition).
2. Authorize Salesforce CLI to access the Salesforce org.
3. Deploy the sources from this project to the Salesforce org:

   ```bash
   sfdx force:source:deploy --sourcepath ./force-app
   ```

4. Create a Lightning Community in the Salesforce org.
5. Create a page with Community Builder.
6. Drag and drop the _Example Component_ from the _Components_ panel to the page.
7. Adjust the parameters of the component as needed. _Hint: If the remote parameter is set to "Special" the Apex controller returns special items, otherwise it returns some default items._

## Project Structure

- See `force-app/main/default/classes` for the Apex classes used to build the server-side Apex controller which is called by the Lightning Web Component to fetch some server data.
- See `force-app/main/default/lwc/exampleComponent` for the implementation of the example Lightning Web Component.

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
