/**
 * Creates the evidence folder structure in Google Drive.
 * Mirrors research/evidence-guide.md
 *
 * Builds the structure inside a folder you already created.
 *
 * How to run:
 *   1. Go to https://script.google.com and click "New project"
 *   2. Paste this whole file in, replacing the default myFunction() stub
 *   3. Open your "vivi" folder in Drive and copy the ID out of the URL:
 *        https://drive.google.com/drive/folders/1AbC...XyZ
 *                                               ^^^^^^^^^^ this part
 *      Paste it into FOLDER_ID below.
 *   4. Select createEvidenceFolders in the function dropdown, then Run.
 *      Approve the Drive permission prompt when it appears.
 *   5. Check the Execution log for the folder link.
 *
 * Safe to re-run: existing folders are reused, not duplicated.
 *
 * If it cannot find the folder, run whoAmI() first — the most common cause
 * is that script.google.com is signed into a different Google account than
 * the Drive you are looking at.
 */

// Paste the folder ID from the Drive URL here. This is the reliable way.
// Leave as '' to fall back to searching by FOLDER_NAME instead.
var FOLDER_ID = '';

// Only used when FOLDER_ID is empty.
var FOLDER_NAME = 'vivi';

var TOP_LEVEL = [
  'Benchmark Assets',
  'Vivideo',
  'Pollo AI',
  'InVideo',
  'Revid',
  'HeyGen',
  'Runway',
  'Receipts - Private'
];

// Which top-level folders get the per-product subfolders.
// Add 'Benchmark Assets' or 'Receipts - Private' here if you want them too.
var PRODUCTS = [
  'Vivideo',
  'Pollo AI',
  'InVideo',
  'Revid',
  'HeyGen',
  'Runway'
];

var SUBFOLDERS = [
  'Homepage and Pricing',
  'Onboarding',
  'Benchmark Outputs',
  'Editing and Export',
  'Paywalls',
  'Cancellation',
  'User Reviews'
];

function createEvidenceFolders() {
  var root = resolveRoot();
  var created = 0;

  TOP_LEVEL.forEach(function (name) {
    var folder = getOrCreate(root, name);
    created++;

    if (PRODUCTS.indexOf(name) === -1) return;

    SUBFOLDERS.forEach(function (sub) {
      getOrCreate(folder, sub);
      created++;
    });
  });

  Logger.log('Done. %s folders ensured.', created);
  Logger.log('Open: %s', root.getUrl());
}

/**
 * Prints which account the script is running as, and what is actually
 * sitting at the top of that account's My Drive. Run this when the
 * folder lookup fails.
 */
function whoAmI() {
  Logger.log('Running as: %s', Session.getEffectiveUser().getEmail());

  var folders = DriveApp.getRootFolder().getFolders();
  Logger.log('Folders at the top of My Drive:');
  while (folders.hasNext()) {
    var f = folders.next();
    Logger.log('  %s   (id: %s)', f.getName(), f.getId());
  }
}

function resolveRoot() {
  if (FOLDER_ID) {
    try {
      var byId = DriveApp.getFolderById(FOLDER_ID);
      Logger.log('root: %s (%s)', byId.getName(), byId.getUrl());
      return byId;
    } catch (e) {
      throw new Error('Could not open folder with ID "' + FOLDER_ID + '". ' +
                      'Check the ID, and that this account has access to it. ' +
                      'Run whoAmI() to see which account you are running as.');
    }
  }
  return findByName(FOLDER_NAME);
}

/**
 * Searches the whole Drive, not just the top level, and ignores case.
 * Fails loudly rather than silently creating a folder in the wrong place.
 */
function findByName(name) {
  var matches = [];
  var it = DriveApp.getFoldersByName(name);
  while (it.hasNext()) matches.push(it.next());

  if (matches.length === 0) {
    throw new Error('No folder named "' + name + '" in this account\'s Drive. ' +
                    'Run whoAmI() to check which account you are signed in as, ' +
                    'or set FOLDER_ID to the folder ID from the Drive URL.');
  }
  if (matches.length > 1) {
    matches.forEach(function (f) { Logger.log('match: %s', f.getUrl()); });
    throw new Error('Found ' + matches.length + ' folders named "' + name + '". ' +
                    'Set FOLDER_ID to the one you want (see the logged URLs).');
  }

  Logger.log('root: %s (%s)', name, matches[0].getUrl());
  return matches[0];
}

function getOrCreate(parent, name) {
  var existing = parent.getFoldersByName(name);
  if (existing.hasNext()) {
    var found = existing.next();
    Logger.log('exists: %s', name);
    return found;
  }
  Logger.log('create: %s', name);
  return parent.createFolder(name);
}
