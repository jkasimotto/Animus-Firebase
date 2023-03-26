// functions/src/handleDriveNotification.js
const path = require("path");
const serviceAccountKeyPath = path.resolve(
  __dirname,
  "..",
  "serviceAccountKey.json"
);
const test = require("firebase-functions-test")(
  {
    databaseURL: "https://website-f126b.firebaseio.com",
    storageBucket: "website-f126b.appspot.com",
    projectId: "website-f126b",
  },
  serviceAccountKeyPath
);

jest.mock("firebase-admin", () => {
  const firestoreMock = {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn(),
      })),
    })),
    FieldValue: {
      serverTimestamp: jest.fn(),
    },
  };

  return {
    initializeApp: jest.fn(),
    firestore: jest.fn(() => firestoreMock),
    __resetFirestoreMock: () => {
      Object.values(firestoreMock.collection.mock.instances).forEach(
        (instance) => {
          instance.doc.mockClear();
          instance.doc.mockReturnValue({
            set: jest.fn(),
          });
        }
      );
      firestoreMock.collection.mockClear();
      firestoreMock.collection.mockReturnValue({
        doc: jest.fn(() => ({
          set: jest.fn(),
        })),
      });
    },
  };
});

// Mocking the necessary dependencies
jest.mock("../src/utils/drive/getChannelData");
jest.mock("../src/utils/drive/getUserData");
jest.mock("../src/utils/drive/getDriveApiClient");
jest.mock("../src/utils/drive/getDriveFiles");
jest.mock("../src/handleDriveNotification/utils/logHeadersAndNotification");
jest.mock("../src/handleDriveNotification/utils/validateHeaders");

const admin = require("firebase-admin");
const getChannelData = require("../src/utils/drive/getChannelData");
const getUserData = require("../src/utils/drive/getUserData");
const getDriveApiClient = require("../src/utils/drive/getDriveApiClient");
const getDriveFiles = require("../src/utils/drive/getDriveFiles");
const logHeadersAndNotification = require("../src/handleDriveNotification/utils/logHeadersAndNotification");
const validateHeaders = require("../src/handleDriveNotification/utils/validateHeaders");

admin.initializeApp();

// After firebase-functions-test has been initialized
const {
  handleDriveNotification,
} = require("../src/handleDriveNotification/index");

describe("handleDriveNotification", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should validate headers and return early if invalid", async () => {
    const req = {
      method: "POST",
      get: jest.fn((headerName) => {
        if (headerName === "X-Goog-Resource-State") return "exists";
        if (headerName === "X-Goog-Channel-ID") return "test-channel-id";
        if (headerName === "X-Goog-Message-Number") return "1";
        if (headerName === "X-Goog-Resource-ID") return "test-resource-id";
        if (headerName === "X-Goog-Resource-URI") return "test-resource-uri";
      }),
    };

    const res = {
      status: jest.fn(() => res),
      send: jest.fn(() => res),
    };

    validateHeaders.mockImplementation((req, res) => false);

    await handleDriveNotification(req, res);

    expect(validateHeaders).toHaveBeenCalledWith(req, res);
    expect(logHeadersAndNotification).not.toHaveBeenCalled();
    expect(getChannelData).not.toHaveBeenCalled();
    expect(getUserData).not.toHaveBeenCalled();
    expect(getDriveApiClient).not.toHaveBeenCalled();
    expect(getDriveFiles).not.toHaveBeenCalled();
    expect(admin.firestore().collection).not.toHaveBeenCalled();
  });

  it("should log headers and notification", async () => {
    const req = {
      method: "POST",
      get: jest.fn((headerName) => {
        if (headerName === "X-Goog-Resource-State") return "exists";
        if (headerName === "X-Goog-Channel-ID") return "test-channel-id";
        if (headerName === "X-Goog-Message-Number") return "1";
        if (headerName === "X-Goog-Resource-ID") return "test-resource-id";
        if (headerName === "X-Goog-Resource-URI") return "test-resource-uri";
      }),
    };

    const res = {
      status: jest.fn(() => res),
      send: jest.fn(() => res),
    };

    validateHeaders.mockImplementation((req, res) => true);
    getChannelData.mockImplementation(() => {
      return {
        uid: "test-uid",
        channelId: "test-channel-id",
        resourceId: "test-resource-id",
      };
    });
    getUserData.mockImplementation(() => {
      return {
        email: "test-email",
        name: "test-name",
      };
    });
    getDriveApiClient.mockImplementation(() => {
      return {
        files: {
          list: jest.fn(() => {
            return {
              data: {
                files: [
                  {
                    id: "test-file-id",
                    name: "test-file-name",
                    mimeType: "test-mime-type",
                    webViewLink: "test-web-view-link",
                    webContentLink: "test-web-content-link",
                    thumbnailLink: "test-thumbnail-link",
                    iconLink: "test-icon-link",
                    createdTime: "test-created-time",
                    modifiedTime: "test-modified-time",
                    size: "test-size",
                  },
                ],
              },
            };
          }),
        },
      };
    });
    getDriveFiles.mockImplementation(() => {
      return [
        {
          id: "test-file-id",
          name: "test-file-name",
          mimeType: "test-mime-type",
          webViewLink: "test-web-view-link",
          webContentLink: "test-web-content-link",
          thumbnailLink: "test-thumbnail-link",
          iconLink: "test-icon-link",
          createdTime: "test-created-time",
          modifiedTime: "test-modified-time",
          size: "test-size",
        },
      ];
    });

    console.log(admin.firestore())
    expect(admin.firestore()).toBe(admin.firestore())
    await handleDriveNotification(req, res);
    

    expect(validateHeaders).toHaveBeenCalledWith(req, res);
    expect(logHeadersAndNotification).toHaveBeenCalled();
    expect(getChannelData).toHaveBeenCalled();
    expect(getUserData).toHaveBeenCalled();
    expect(getDriveApiClient).toHaveBeenCalled();
    expect(getDriveFiles).toHaveBeenCalled();
    expect(admin.firestore().collection).toHaveBeenCalled();
  });
});
