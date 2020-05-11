FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
)

FilePond.setOptions ({
    stylePanelAspectRatio: 150 / 100,
    imageResizeTargetWidth: 400,
    imageResizeTargetHeight: 450
})

FilePond.parse(document.body)