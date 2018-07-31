import {ClickOverlay} from './clickoverlay';
import {UIInstanceManager} from '../uimanager';

/**
 * A simple click capture overlay for clickThroughUrls of ads.
 */
export class AdClickOverlay extends ClickOverlay {

  configure(player: bitmovin.PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    let clickThroughUrl = <string>null;
    let clickThroughEnabled = !player.getConfig().advertising
      || !player.getConfig().advertising.hasOwnProperty('clickThroughEnabled')
      || player.getConfig().advertising.clickThroughEnabled;

    player.on(player.Event.AdStarted, (event: bitmovin.PlayerAPI.AdStartedEvent) => {
      clickThroughUrl = event.clickThroughUrl;

      if (clickThroughEnabled) {
        this.setUrl(clickThroughUrl);
      } else {
        // If click-through is disabled, we set the url to null to avoid it open
        this.setUrl(null);
      }
    });

    // Clear click-through URL when ad has finished
    let adFinishedHandler = () => {
      this.setUrl(null);
    };
    player.on(player.Event.AdFinished, adFinishedHandler);
    player.on(player.Event.AdSkipped, adFinishedHandler);
    player.on(player.Event.AdError, adFinishedHandler);

    this.onClick.subscribe(() => {
      // Pause the ad when overlay is clicked
      player.pause('ui-content-click');

      // Notify the player of the clicked ad
      player.fireEvent(player.Event.AdClicked, {
        clickThroughUrl: clickThroughUrl,
      });
    });
  }
}