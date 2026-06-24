async function registerUser() {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "Processing application details and uploading photos...";
    resultDiv.style.color = "#475569";

    const formData = new FormData();
    formData.append("fullName", document.getElementById("fullName").value);
    formData.append("displayName", document.getElementById("displayName").value);
    formData.append("age", Number(document.getElementById("age").value));
    formData.append("gender", document.getElementById("gender").value);
    formData.append("country", document.getElementById("country").value);
    formData.append("city", document.getElementById("city").value);
    formData.append("whatsapp", document.getElementById("whatsapp").value);
    formData.append("occupation", document.getElementById("occupation").value);
    formData.append("education", document.getElementById("education").value);
    formData.append("religion", document.getElementById("religion").value);
    formData.append("height", document.getElementById("height").value);
    formData.append("maritalStatus", document.getElementById("maritalStatus").value);
    formData.append("children", document.getElementById("children").value);
    formData.append("aboutMe", document.getElementById("aboutMe").value);
    formData.append("goal", document.getElementById("goal").value);
    formData.append("preference", document.getElementById("preference").value);

    // Append multiple files loop
    const imageInput = document.getElementById("imageInput");
    for (let i = 0; i < imageInput.files.length; i++) {
        formData.append("images", imageInput.files[i]);
    }

    // Handle environment URLs seamlessly
    const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://localhost:3000"
        : window.location.origin;

    try {
        const response = await fetch(`${API_BASE_URL}/api/users/register`, {
            method: "POST",
            body: formData 
        });

        const result = await response.json();

        if (result.success) {
            resultDiv.innerHTML = "✅ Application Profile Submitted Successfully!";
            resultDiv.style.color = "#10b981";
            
            // Cache details to customize the welcome experience on the dashboard
            const savedName = document.getElementById("displayName").value || document.getElementById("fullName").value;
            localStorage.setItem("registeredClientName", savedName);

            // Redirect smoothly to the soft-launch client dashboard
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1500);
        } else {
            resultDiv.innerHTML = "❌ Submission Failed: " + result.message;
            resultDiv.style.color = "#ef4444";
        }
    } catch (error) {
        console.error("Transmission error:", error);
        resultDiv.innerHTML = "❌ Connection timeout. Server offline.";
        resultDiv.style.color = "#ef4444";
    }
}