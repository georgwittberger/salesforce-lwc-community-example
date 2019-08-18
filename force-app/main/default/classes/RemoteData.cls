/**
 * Data class to be used for responses of the Apex controller.
 */
public class RemoteData {

  /*
   * Note that it is important to add the @AuraEnabled annotation to fields
   * which should be exposed to Aura or Lightning Web Components.
   */

  @AuraEnabled
  public String id { get; set; }
  @AuraEnabled
  public String text { get; set; }

  public RemoteData(String id, String text) {
    this.id = id;
    this.text = text;
  }
}
