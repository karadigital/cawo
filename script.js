$(document).ready(function () {
  const $fileInput = $("#file-input");
  const $fileList = $("#file-list");
  const $previewContainer = $("#preview-container");
  const $dropArea = $("#drop-area");
  const $fileError = $("#file-error");
  const $submitBtn = $("#submit-btn");
  const $form = $("#upload-form");

  let files = [];

  // Handle file selection
  $fileInput.on("change", function (e) {
    handleFiles(e.target.files);
  });

  // Drag and drop functionality
  ["dragenter", "dragover", "dragleave", "drop"].forEach(function (eventName) {
    $dropArea.on(eventName, preventDefaults);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ["dragenter", "dragover"].forEach(function (eventName) {
    $dropArea.on(eventName, highlight);
  });

  ["dragleave", "drop"].forEach(function (eventName) {
    $dropArea.on(eventName, unhighlight);
  });

  function highlight() {
    $dropArea.css("border-color", "#4CAF50");
  }

  function unhighlight() {
    $dropArea.css("border-color", "#ccc");
  }

  $dropArea.on("drop", function (e) {
    const dt = e.originalEvent.dataTransfer;
    const droppedFiles = dt.files;
    handleFiles(droppedFiles);
  });

  // Handle the selected files
  function handleFiles(selectedFiles) {
    $fileError.text("");

    // Check if files were selected
    if (selectedFiles.length === 0) return;

    // Check total files count (limit to 10 for example)
    if (files.length + selectedFiles.length > 10) {
      $fileError.text("Maximum 10 files allowed");
      return;
    }

    // Check each file
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        $fileError.text(`File ${file.name} is too large (max 5MB)`);
        continue;
      }

      // Check file type
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(file.type)) {
        $fileError.text(`File ${file.name} has invalid type`);
        continue;
      }

      // Add to files array if valid
      files.push(file);
    }

    updateFileList();
    updateSubmitButton();
  }

  // Update the file list display
  function updateFileList() {
    $fileList.empty();

    if (files.length === 0) {
      $fileList.html("<p>No files selected</p>");
      return;
    }

    files.forEach(function (file, index) {
      const fileItem = $('<div class="file-item"></div>');
      const fileInfo = $('<div class="file-info"></div>');
      const fileIcon = $(`<span class="file-icon">${getFileIcon(file.type)}</span>`);
      const fileName = $(`<span>${file.name} (${formatFileSize(file.size)})</span>`);
      const removeBtn = $('<button class="remove-btn">&times;</button>');

      removeBtn.on("click", function () {
        removeFile(index);
      });

      fileInfo.append(fileIcon, fileName);
      fileItem.append(fileInfo, removeBtn);
      $fileList.append(fileItem);
    });

    // Update previews for image files
    updatePreviews();
  }

  // Update image previews
  function updatePreviews() {
    $previewContainer.empty();

    files.forEach(function (file, index) {
      if (file.type.startsWith("image/")) {
        const previewItem = $('<div class="preview-item"></div>');
        const img = $("<img>").attr("src", URL.createObjectURL(file));
        const removeBtn = $('<button class="remove-preview">&times;</button>');

        removeBtn.on("click", function () {
          removeFile(index);
        });

        previewItem.append(img, removeBtn);
        $previewContainer.append(previewItem);
      }
    });
  }

  // Remove a file
  function removeFile(index) {
    files.splice(index, 1);
    updateFileList();
    updateSubmitButton();
  }

  // Get appropriate icon for file type
  function getFileIcon(type) {
    if (type.startsWith("image/")) return "📷";
    if (type.includes("pdf")) return "📄";
    if (type.includes("word")) return "📝";
    return "📁";
  }

  // Format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  // Enable/disable submit button based on files
  function updateSubmitButton() {
    $submitBtn.prop("disabled", files.length === 0);
  }

  // Form submission
  $form.on("submit", function (e) {
    e.preventDefault();

    if (files.length === 0) {
      $fileError.text("Please select at least one file");
      return;
    }

    // Create FormData and append files
    const formData = new FormData();
    files.forEach(function (file, index) {
      formData.append(`file_${index}`, file);
    });

    // Here you would send the files to your server
    // This is just a simulation
    $submitBtn.prop("disabled", true);
    $submitBtn.text("Uploading...");

    // Simulate AJAX request
    setTimeout(function () {
      alert(`${files.length} files uploaded successfully!`);
      files = [];
      updateFileList();
      updatePreviews();
      updateSubmitButton();
      $submitBtn.text("Upload Files");
    }, 1500);

    // Actual AJAX request would look like:
    /*
      $.ajax({
        url: 'your-upload-endpoint',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data) {
          alert('Upload successful!');
          files = [];
          updateFileList();
          updatePreviews();
          updateSubmitButton();
          $submitBtn.text('Upload Files');
        },
        error: function(error) {
          alert('Error uploading files: ' + error.responseText);
          $submitBtn.prop('disabled', false);
          $submitBtn.text('Upload Files');
        }
      });
      */
  });
});
