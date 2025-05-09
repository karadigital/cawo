// Main JavaScript file with jQuery code

$(document).ready(function () {
  // Modal functionality
  const $modal = $("#registration-modal");
  const $btn = $(".openModalBtn");
  const $span = $(".close-btn");
  const $fileInput = $("#file-input");
  const $fileList = $("#file-list");

  const $dropArea = $("#drop-area");
  const $fileError = $("#file-error");
  const $submitBtn = $("#submit-btn");
  const $form = $("#upload-form");
  let files = [];

  $fileInput.on("change", function (e) {
    handleFiles(e.target.files);
  });

  $btn.on("click", function () {
    $modal.css("display", "block");
  });

  $span.on("click", function () {
    $modal.css("display", "none");
  });

  // Accordion functionality
  $(".accordion__item").on("click", function () {
    const $this = $(this);

    // Change active item
    $(".accordion__item").removeClass("active");
    $this.addClass("active");

    // Get unique image class from active item
    const imgClass = $this
      .find(".accordion__img")
      .attr("class")
      ?.match(/accordion__img-\d+/)?.[0];

    // Change desktop image
    $(".how-it-works__img-desktop .accordion__img").removeClass("active");
    if (imgClass) {
      $(".how-it-works__img-desktop ." + imgClass).addClass("active");
    }
  });

  // File upload functionality
  let selectedFiles = [];

  // When files are selected
  $("#file-input").change(function (e) {
    // Clear previous selection
    selectedFiles = [];
    $("#file-list").empty();

    // Add new files to array and display them
    $.each(e.target.files, function (index, file) {
      selectedFiles.push(file);
      $("#file-list").append(
        `<div class="file-item" id="file-${index}">
              ${file.name} (${formatFileSize(file.size)})
              <div class="progress">
                  <div class="progress-bar" id="progress-${index}" style="width: 0%">0%</div>
              </div>
              <div id="status-${index}"></div>
          </div>`
      );
    });
  });

  // Upload button click handler
  $("#uploadBtn").click(function () {
    if (selectedFiles.length === 0) {
      $("#status").html('<span class="error">Please select at least one file</span>');
      return;
    }

    $("#status").html("Uploading files...");

    // Upload each file
    $.each(selectedFiles, function (index, file) {
      uploadFile(index, file);
    });
  });

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
  }

  function updateSubmitButton() {
    // Enable/disable submit button based on file selection
    if (files.length > 0) {
      $submitBtn.prop("disabled", false);
    } else {
      $submitBtn.prop("disabled", true);
    }
  }

  // Initialize default active image for desktop
  const initialImgClass = $(".accordion__item.active .accordion__img")
    .attr("class")
    ?.match(/accordion__img-\d+/)?.[0];

  if (initialImgClass) {
    $(".how-it-works__img-desktop .accordion__img").removeClass("active");
    $(".how-it-works__img-desktop ." + initialImgClass).addClass("active");
  }

  // Character counter for message fields
  $("#message").on("input", function () {
    const currentLength = $(this).val().length;
    $("#char-count").text(`${currentLength} / 1000`);
  });

  $("#char-count").text(`${$("#message").val().length} / 1000`);

  $("#message").on("input", function () {
    const currentLength = $(this).val().length;
    $("#pop-char-count").text(`${currentLength} / 1000`);
  });

  $("#pop-char-count").text(`${$("#message").val().length} / 1000`);
});

// File upload functionality (converted from vanilla JS to jQuery)
$(document).ready(function () {
  const maxFiles = 5; // The maximum number of files that can be uploaded
  const fileInputs = []; // Track which inputs are filled
  const fileList = []; // Track file objects for display
  const $fileListElement = $("#file-list"); // The file list display
  const $hiddenFileBlock = $("#hidden-file-block"); // Hidden block for file inputs

  // Trigger the hidden file input to simulate clicking
  function triggerFileInput(event) {
    console.log("Triggering file input");
    if (fileList.length >= maxFiles) {
      alert("You can only upload up to 5 files.");
      return;
    }

    // Find the next available file input
    const availableInput = getNextAvailableFileInput();
    if (availableInput) {
      console.log("Triggering file input", availableInput);
      availableInput.click(); // Programmatically trigger the input
    }
  }

  // Handle file input changes
  function handleFileChange(index) {
    const input = $(`#upload-image-${index}`)[0];
    if (!input || !input.files || input.files.length === 0) return;

    const file = input.files[0]; // Get the selected file
    if (validateFile(file)) {
      addFile(file, index); // Add the file to the list
    } else {
      input.value = ""; // Clear the invalid file
    }
  }

  // Validate a file before adding
  function validateFile(file) {
    const maxFileSize = 5 * 1024 * 1024; // Maximum size in bytes (5MB)
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"]; // Allowed file types

    if (!allowedTypes.includes(file.type)) {
      alert(`${file.name} is not a valid file type. Only JPG, PNG, and PDF are allowed.`);
      return false;
    }

    if (file.size > maxFileSize) {
      alert(`${file.name} exceeds the maximum file size of 5MB.`);
      return false;
    }

    return true;
  }

  // Add a file to the list and update UI
  function addFile(file, index) {
    // Check if the file already exists in the list
    if (fileList.find((f) => f.name === file.name)) {
      alert(`${file.name} has already been added.`);
      return;
    }

    // Add file to the list
    fileList.push(file);
    fileInputs.push(index);

    // Update the file list display
    updateFileList();
  }

  // Remove a file from the list
  function removeFile(index) {
    const fileName = fileList[index].name; // Get the file name to remove
    fileList.splice(index, 1); // Remove the file from the list

    // Clear the corresponding hidden input
    const inputIndex = fileInputs[index];
    const input = $(`#upload-image-${inputIndex}`)[0];
    if (input) input.value = "";

    // Update the input tracking and the UI
    fileInputs.splice(index, 1);
    updateFileList();
    console.log(`${fileName} has been removed.`);
  }

  // Display the file list in the UI
  function updateFileList() {
    $fileListElement.empty(); // Clear the existing list
    $(".preview-container").empty();

    // Add each file to the list
    fileList.forEach((file, index) => {
      if (file.type.startsWith("image/")) {
        const $previewItem = $('<div class="preview-item"></div>');

        const $img = $("<img>").attr("src", URL.createObjectURL(file));

        const $removeBtn = $('<span class="remove-preview">&times;</span>');

        $removeBtn.on("click", function () {
          removeFile(index);
        });

        $previewItem.append($img, $removeBtn);
        $(".preview-container").append($previewItem);
      }
    });
  }

  // Find the next available hidden file input
  function getNextAvailableFileInput() {
    for (let i = 1; i <= maxFiles; i++) {
      const input = $(`#upload-image-${i}`)[0];
      if (input && !fileInputs.includes(i)) {
        return input;
      }
    }
    return null; // No available inputs
  }

  // Initialize Splide slider
  new Splide("#testimonials__slider", {
    mediaQuery: "min",
    type: "loop",
    padding: "3rem",
    perPage: 1,
    perMove: 1,
    pagination: false,
    gap: "20px",
    breakpoints: {
      1024: {
        perPage: 2,
        padding: "2.5rem",
      },
    },
  }).mount();

  // Add event listener for file upload button
  $("#add-file-button").on("click", triggerFileInput);

  // Make handleFileChange function globally available
  window.handleFileChange = handleFileChange;

  // Add form submission handler to check for required files
  $('form[name="contactQuote"]').on("submit", function (e) {
		const $submitButton = $(this).find('button[type="submit"]');
	
		$submitButton.prop('disabled', true);
		$submitButton.addClass('button--disabled');
		$submitButton.text('Submitting...');
		
		setTimeout(function() {
			$submitButton.prop('disabled', false);
			$submitButton.removeClass('button--disabled');
			$submitButton.text('Submit');
		}, 10000); 
    // Check if any file inputs are required but empty
    const $requiredFileInputs = $("#hidden-file-block input[required]");
    let hasEmptyRequiredFiles = false;

    $requiredFileInputs.each(function () {
      if (!this.files || this.files.length === 0) {
        hasEmptyRequiredFiles = true;
        return false; // Break the loop
      }
    });

    if (hasEmptyRequiredFiles) {
      e.preventDefault(); // Prevent form submission

      // Create warning message if it doesn't exist
      if ($("#file-warning").length === 0) {
        const $warning = $('<div id="file-warning" class="text-error mt-2">Please upload at least one file</div>');
        $(".input__layout-modal.picture").append($warning);
      } else {
        $("#file-warning").show();
      }

      // Scroll to the warning
      $("html, body").animate(
        {
          scrollTop: $("#file-warning").offset().top - 100,
        },
        500
      );
    } else {
      // Hide warning if it exists
      $("#file-warning").hide();
    }
  });
});

$('form[name="contact"], form[name="contactQuote"]').on("submit", function (e) {
	const $submitButton = $(this).find('button[type="submit"]');
	
	$submitButton.prop('disabled', true);
	$submitButton.addClass('button--disabled');
	$submitButton.text('Submitting...');
	
	setTimeout(function() {
		$submitButton.prop('disabled', false);
		$submitButton.removeClass('button--disabled');
		$submitButton.text('Submit');
	}, 10000); 
});