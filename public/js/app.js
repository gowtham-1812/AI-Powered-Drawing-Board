const recognize = document.getElementById("recognize");

function getBase64Image() {
    const canvas = document.querySelector("canvas");
    return canvas.toDataURL().split(",")[1]; // Remove the data URL prefix
}

recognize.addEventListener("click", async () => {
    try {
        const imageData = getBase64Image();
        
        const response = await fetch("/recognize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ imageData })
        });
        
        const result = await response.json();
        alert(`Gemini's Response: ${result.message}`);
        
    } catch (error) {
        console.error("Recognition failed:", error);
        alert("Recognition failed. Please try again.");
    }
});