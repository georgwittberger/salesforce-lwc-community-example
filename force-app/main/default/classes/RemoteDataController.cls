/**
 * Controller class defining the method which is invoked by the Lightning Web Component.
 */
public with sharing class RemoteDataController {
  /**
   * Remote method to provide data to the Lightning Web Component.
   *
   * @param queryParam Input parameter sent by the Lightning Web Component.
   * @return List of data objects to be returned to the Lightning Web Component.
   */
  @AuraEnabled(cacheable = true)
  public static List<RemoteData> getRemoteData(String queryParam) {
    if (queryParam.equalsIgnoreCase('special')) {
      return new List<RemoteData> {
        new RemoteData('1', 'Special Item 1'),
        new RemoteData('2', 'Special Item 2')
      };
    } else {
      return new List<RemoteData> {
        new RemoteData('1', 'Default Item 1'),
        new RemoteData('2', 'Default Item 2')
      };
    }
  }
}
