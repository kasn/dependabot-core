const path = require("path");
const os = require("os");
const fs = require("fs");
const rimraf = require("rimraf");
const { updateDependencyFile } = require("../../lib/npm7/subdependency-updater");
const helpers = require("./helpers");

describe("updater", () => {
  let tempDir;
  beforeEach(() => {
    tempDir = fs.mkdtempSync(os.tmpdir() + path.sep);
  });
  afterEach(() => rimraf.sync(tempDir));

  it("generates an updated package-lock.json", async () => {
    helpers.copyDependencies("subdependency-updater/subdependency-in-range", tempDir);

    const result = await updateDependencyFile(tempDir, "package-lock.json", [
      {
        name: "ms",
        version: "2.1.3",
        requirements: [{ file: "package.json", groups: ["dependencies"] }],
      },
    ]);

    const lockfile = JSON.parse(result["package-lock.json"]);
    expect(lockfile.dependencies.ms.version).toEqual("2.1.3")
  });
});
