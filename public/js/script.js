const canvas = document.querySelector("canvas"),
context = canvas.getContext("2d"),
toolBtns = document.querySelectorAll(".tool"),
textInput = document.querySelector("#text-input"),
brushSize = document.querySelector("#brush-size"),
color = document.querySelector("#color-picker"),
clear = document.querySelector("#clear-btn"),
save = document.querySelector("#save-btn");

let isDrawing = false,
brushWidth = 5,
selectedTool = "brush",
selectedColor = "#000",
clickX, clickY; // for text input position

function setCanvasBackground() {
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener("load", () => {
    // returns viewable width/height of element
    // makes brush draw and follow mouse pointer properly
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // remove active selection from prev option and addding it to current option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        
        if (selectedTool === "brush") {
            context.strokeStyle = selectedColor;
        } else if (selectedTool === "eraser") {
            context.strokeStyle = "#fff";
        } else if (selectedTool === "text") {
            canvas.style.cursor = "text";
        } else {
            canvas.style.cursor = "default";
            textInput.style.display = "none";
        }
    });
});

textInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const text = textInput.value;

        context.font = "24px Poppins";
        context.fillStyle = selectedColor;
        context.textBaseline = "top";
        context.fillText(text, clickX, clickY);

        textInput.style.display = "none";
        textInput.value = "";
    }
});

function handleTextInput(event) {
    if (selectedTool === "text") {
        // Update the click position
        clickX = event.offsetX;
        clickY = event.offsetY;

        // Show input field at click position
        textInput.style.top = `${event.clientY}px`;
        textInput.style.left = `${event.clientX}px`;
        textInput.style.display = "block";
        textInput.focus();
    }
}

canvas.addEventListener("click", handleTextInput);

color.addEventListener("change", () => {
    selectedColor = color.value;
    
    if (selectedTool === "brush") {
        context.strokeStyle = selectedColor;
    }
});

brushSize.addEventListener("change", () => brushWidth = brushSize.value);

clear.addEventListener("click", () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
});

save.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
});

canvas.addEventListener("mousedown", () => {
    isDrawing = true;
    context.beginPath(); // creating new path draw
    context.lineWidth = brushWidth; // Passing the chosen brush width
    
    if (selectedTool === "eraser") {
        context.strokeStyle = "#fff";
    } else {
        context.strokeStyle = selectedColor;
        context.fillStyle = selectedColor;
    }
});

canvas.addEventListener("mousemove", (event) => {
    if (!isDrawing || selectedTool === "text")
        return;

    context.lineTo(event.offsetX, event.offsetY); // creating line according to mouse pointer
    context.stroke(); // drawing/filling the line with colour
});

canvas.addEventListener("mouseup", () => isDrawing = false);

canvas.addEventListener("mouseleave", () => {
    isDrawing = false;
    context.beginPath();
});