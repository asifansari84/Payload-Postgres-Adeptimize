/**
 * Admin notification wording, merged over Payload's English defaults.
 * Short, past tense, names what changed, and on failure says what to do next.
 * `{{label}}` is the collection label, `{{title}}` the document title, `{{count}}`/`{{total}}` numbers.
 */
export const adminNotifications = {
  authentication: {
    // Login field label (Payload's default is "Email or Username").
    emailOrUsername: 'Username or Email',
  },
  general: {
    successfullyCreated: '{{label}} created.',
    updatedSuccessfully: 'Changes saved.',
    updatedLabelSuccessfully: '{{label}} updated.',
    updatedCountSuccessfully: '{{count}} {{label}} updated.',
    successfullyDuplicated: '{{label}} duplicated. You’re now editing the copy.',
    deletedSuccessfully: 'Deleted.',
    titleDeleted: '{{label}} “{{title}}” deleted.',
    deletedCountSuccessfully: '{{count}} {{label}} deleted.',
    permanentlyDeletedCountSuccessfully: '{{count}} {{label}} permanently deleted.',
    titleTrashed: '{{label}} “{{title}}” moved to trash.',
    trashedCountSuccessfully: '{{count}} {{label}} moved to trash.',
    titleRestored: '{{label}} “{{title}}” restored.',
    restoredCountSuccessfully: '{{count}} {{label}} restored.',
  },
  version: {
    draftSavedSuccessfully: 'Draft saved.',
    autosavedSuccessfully: 'Draft autosaved.',
    restoredSuccessfully: 'Version restored.',
    unpublishedSuccessfully: 'Unpublished. It’s no longer visible on the site.',
  },
  error: {
    unknown: 'Something went wrong. Please try again.',
    unspecific: 'Something went wrong. Please try again.',
    correctInvalidFields: 'Some fields need attention. Fix the highlighted fields and save again.',
    deletingTitle: 'Couldn’t delete “{{title}}”. Check your connection and try again.',
    deletingFile: 'The file couldn’t be deleted. Please try again.',
    restoringTitle: 'Couldn’t restore “{{title}}”. Check your connection and try again.',
    unableToDeleteCount: 'Couldn’t delete {{count}} of {{total}} {{label}}. Please try again.',
    unableToUpdateCount: 'Couldn’t update {{count}} of {{total}} {{label}}. Please try again.',
    problemUploadingFile: 'The file couldn’t be uploaded. Please try again.',
    noFilesUploaded: 'No file selected. Choose a file to upload.',
    invalidFileType: 'This file type isn’t supported.',
    invalidFileTypeValue: 'This file type isn’t supported: {{value}}',
    notAllowedToPerformAction: 'You don’t have permission to do that.',
    autosaving: 'Autosave failed. Your latest changes may not be saved.',
    unPublishingDocument: 'Couldn’t unpublish. Please try again.',
    revertingDocument: 'Couldn’t revert this document. Please try again.',
  },
}
