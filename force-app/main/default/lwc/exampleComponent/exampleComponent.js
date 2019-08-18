import { LightningElement, api, wire } from "lwc";
import getRemoteData from "@salesforce/apex/RemoteDataController.getRemoteData";

/**
 * Class of the example Lightning Web Component.
 */
export default class ExampleComponent extends LightningElement {
  /** Input parameter for an arbitrary editorial text. */
  @api editorParam = "";

  /** Input parameter for a value to be sent to the Apex controller. */
  @api remoteParam = "";

  /** Remote data property receiving the result of the Apex method invocation. */
  @wire(getRemoteData, { queryParam: "$remoteParam" })
  remoteData;
}
