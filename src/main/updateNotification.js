import axios from 'axios';
import semver from 'semver';
import { dialog, shell } from 'electron'; // eslint-disable-line

// TODO: refactor this to be reuseable outside of this context
const github = axios.create({ baseURL: 'https://api.github.com' });
let ignore = false;

export default function () {
  if (ignore) return;
  github.get('/repos/e-e-e/dat-library/releases/latest')
    .then((res) => {
      if (semver.lt(DAT_LIBRARY.package_version, res.data.tag_name)) {
        dialog.showMessageBox({
          type: 'info',
          buttons: ['Not now', 'Update'],
          defaultId: 1,
          cancelId: 0,
          title: 'Update Nofification',
          message: 'There is a new version of Dat Library Available.',
          detail: `You are running v${DAT_LIBRARY.npm_package_version}.\nThe latest version is ${res.data.tag_name}.\n\nYou will need to download and install the latest version manually to update. Click update to view the latest version.`,
          checkboxLabel: 'Don’t tell me again.',
        }, (clickedId, checked) => {
          if (clickedId === 1) {
            shell.openExternal(res.data.html_url);
          }
          if (checked) {
            ignore = true;
          }
        });
      }
    })
    .catch((e) => {
      // silently fail
      console.log(e);
    });
}
