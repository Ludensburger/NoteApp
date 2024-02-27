document.body.setAttribute("id", "rootNode");

document.addEventListener("DOMContentLoaded", function () {
  const currentTimeElement = document.getElementById("currentTime");

  fetch("https://worldtimeapi.org/api/ip")
    .then((response) => response.json())
    .then((data) => {
      const currentTime = new Date(data.datetime);
      const options = {
        hour: "numeric",
        minute: "numeric",
        //   second: "numeric",
      };
      const formattedTime = currentTime.toLocaleTimeString(undefined, options);
      currentTimeElement.textContent = formattedTime;
    })
    .catch((error) => {
      console.error("Error fetching time:", error);
      currentTimeElement.textContent = "Error fetching time";
    });

  // Define updateTime function
  function updateTime() {
    fetch("http://worldtimeapi.org/api/ip")
      .then((response) => response.json())
      .then((data) => {
        const currentTime = new Date(data.datetime);
        const options = {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        };
        const formattedTime = currentTime.toLocaleTimeString(
          undefined,
          options
        );
        currentTimeElement.textContent = formattedTime;
      })
      .catch((error) => {
        console.error("Error fetching time:", error);
        currentTimeElement.textContent = "Error fetching time";
      });
  }

  // Update time initially
  updateTime();

  // Update time every second
  setInterval(updateTime, 100);
});

function createButton(label, id) {
  let createBtn = document.createElement("button");
  createBtn.innerText = label;
  createBtn.setAttribute("id", id);
  createBtn.addEventListener("click", function (event) {
    // Prevent the click event from propagating up to the parent elements
    event.stopPropagation();
    // Remove the note when the delete button is clicked
    event.target.parentNode.remove();
  });

  rootNode.appendChild(createBtn);
  return createBtn; // Make sure to return the button
}

// Function to export notes

//   function getRandomPosition(button) {
//     const buttonWidth = button.offsetWidth;
//     const buttonHeight = button.offsetHeight;
//     const windowWidth = window.innerWidth;
//     const windowHeight = window.innerHeight;
//     const maxX = windowWidth - buttonWidth;
//     const maxY = windowHeight - buttonHeight;
//     const randomX = Math.floor(Math.random() * maxX);
//     const randomY = Math.floor(Math.random() * maxY);
//     return { x: randomX, y: randomY };
//   }

let addNoteBtn = document.getElementById("noteBtn");
let priorityMenu = document.getElementById("priorityMenu");
let inputBox = document.getElementById("noteInput");
let noteList = document.getElementById("noteList");
let noteID = 0;

addNoteBtn.addEventListener("click", () => {
  const noteText = inputBox.value.trim();

  if (noteText !== "") {
    // Create an <li> element, then add unique ID and class name
    let noteItem = document.createElement("li");
    noteItem.className = "note";
    noteItem.id = `note-${noteID++}`;

    // Create the Object
    noteData = {
      note: noteText,
      priority: null,
    };

    // Note Item Styling
    noteItem.style.display = "flex";
    noteItem.style.justifyContent = "space-between";
    noteItem.style.alignItems = "center";

    // Attach the Object to the <li> element
    // noteItem has noteData that uses the values of noteData
    noteItem.noteData = noteData;

    // The note (store)
    noteItem.noteData.note = noteText;

    // The Priority(store)
    let priorityPicked = priorityMenu.value;
    noteItem.noteData.priority = priorityPicked;

    // Display Note
    let noteSpan = document.createElement("span");
    noteSpan.textContent = noteText;
    noteSpan.style.width = "200px"; // Set a fixed width
    noteSpan.style.overflow = "hidden"; // Hide overflowed text
    noteSpan.style.textOverflow = "ellipsis"; // Add ellipsis for overflowed text

    let prioritySpan = document.createElement("span");
    prioritySpan.setAttribute("id", "prioritySpan");
    switch (priorityPicked) {
      case "0": // Compare as a string
        prioritySpan.style.backgroundColor = "green";
        prioritySpan.textContent = "Low";
        prioritySpan.setAttribute("class", priorityPicked);
        break;

      case "1":
        prioritySpan.style.backgroundColor = "orange";
        prioritySpan.setAttribute("class", priorityPicked);
        prioritySpan.textContent = "Medium";
        break;

      case "2":
        prioritySpan.style.backgroundColor = "red";
        prioritySpan.setAttribute("class", priorityPicked);
        prioritySpan.textContent = "High";
        break;
    }

    // The Delete
    let deleteBtn = createButton("delete", "deleteButton");
    deleteBtn.style.backgroundColor = "#ed1313";

    noteItem.appendChild(noteSpan);
    noteItem.appendChild(prioritySpan);
    noteItem.appendChild(deleteBtn);

    noteList.appendChild(noteItem);

    // Clear input box
    inputBox.value = null;
  }
});

let sortHigh = document.getElementById("sortByHigh");
let sortLow = document.getElementById("sortByLow");

sortLow.addEventListener("click", () => {
  // Get the <ul> element
  let ulElement = document.getElementById("noteList");

  // Call the sorting function with descending order (high to low priority)
  // true = ascending
  sortListItemsByPriority(ulElement, true);
});
sortHigh.addEventListener("click", () => {
  // Get the <ul> element
  let ulElement = document.getElementById("noteList");

  // Call the sorting function with descending order (high to low priority)
  // false = descending
  sortListItemsByPriority(ulElement, false);
});

// Sorting Function
function sortListItemsByPriority(ulElement, ascending = true) {
  let items = Array.from(ulElement.children);

  // Sorting the <li> elements based on their priority
  items.sort((a, b) => {
    let priorityA = parseInt(a.noteData.priority);
    let priorityB = parseInt(b.noteData.priority);

    if (ascending) {
      return priorityA - priorityB;
    } else {
      return priorityB - priorityA;
    }
  });

  // Reappending the sorted <li> elements to the <ul> element
  items.forEach((item) => ulElement.appendChild(item));
}

let exportBtn = document.getElementById("ExportBtn");
exportBtn.addEventListener("click", exportListToText);
// Function to export the content of the UL to a text file
function exportListToText() {
  let ulElement = document.getElementById("noteList");
  let items = ulElement.children;
  let textContent = "";

  // Map numerical priority values to corresponding words
  const priorityWords = {
    0: "Low",
    1: "Medium",
    2: "High",
  };

  // Iterate through each <li> element
  for (let i = 0; i < items.length; i++) {
    let li = items[i];
    let noteData = li.noteData;

    // Get the corresponding word for the priority
    let priorityWord = priorityWords[noteData.priority];

    // Append note text and priority to the text content
    textContent += "Note: " + noteData.note + "\n";
    textContent += "Priority: " + priorityWord + "\n\n";
  }

  // Create a blob with the text content
  let blob = new Blob([textContent], { type: "text/plain" });

  // Create a temporary URL for the blob
  let url = URL.createObjectURL(blob);

  // Create a link element to trigger the download
  let link = document.createElement("a");
  link.href = url;
  link.download = "notes.txt";

  // Trigger the download
  link.click();

  // Clean up
  URL.revokeObjectURL(url);
}
