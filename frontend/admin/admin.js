(function checkAuth() {
    if (!localStorage.getItem("adminToken")) {
        window.location.href = "login.html";
    }
})();

async function loadUsers() {
    const usersDiv = document.getElementById("users");
    usersDiv.innerHTML = "<p>Reading secure database feeds...</p>";

    const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://localhost:3000"
        : window.location.origin;

    try {
        const response = await fetch(`${API_BASE_URL}/api/users/all`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` }
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("adminToken");
            window.location.href = "login.html";
            return;
        }

        const users = await response.json();
        if (!users || users.length === 0) {
            usersDiv.innerHTML = "<p>No application profiles found in system memory.</p>";
            return;
        }

        let html = "";
        users.forEach(user => {
            let imagesHtml = "";
            if (user.images && user.images.length > 0) {
                user.images.forEach(url => {
                    imagesHtml += `<img src="${url}" style="width:90px;height:90px;object-fit:cover;border-radius:8px;margin:4px;border:1px solid #e2e8f0;">`;
                });
            } else {
                imagesHtml = "<em>No media attachments uploaded</em>";
            }

            const badgeColor = user.paymentStatus === "Paid" ? "#10b981" : "#ef4444";

            html += `
                <div style="border:1px solid #e2e8f0; padding:25px; margin-bottom:20px; border-radius:12px; background:white; box-shadow:0 4px 6px rgba(0,0,0,0.02);">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <h2 style="color:#ff4d6d; margin:0;">${user.fullName}</h2>
                        <span style="background:${badgeColor}; color:white; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:600;">${user.paymentStatus}</span>
                    </div>
                    <hr style="border:0; border-top:1px solid #f1f5f9; margin:15px 0;">
                    <p><b>Public Tag:</b> ${user.displayName || "N/A"} | <b>Age:</b> ${user.age || "N/A"} | <b>Gender:</b> ${user.gender}</p>
                    <p><b>Location:</b> ${user.city || "N/A"}, ${user.country || "N/A"}</p>
                    <p><b>WhatsApp Contact:</b> <a href="https://wa.me/${user.whatsapp}" target="_blank" style="color:#10b981; font-weight:600; text-decoration:none;">${user.whatsapp || "N/A"} 💬</a></p>
                    <p><b>Profession:</b> ${user.occupation || "N/A"} | <b>Education:</b> ${user.education || "N/A"} | <b>Religion:</b> ${user.religion || "N/A"}</p>
                    <p><b>Height:</b> ${user.height || "N/A"} | <b>Marital Status:</b> ${user.maritalStatus || "N/A"} | <b>Children:</b> ${user.children || "N/A"}</p>
                    <p><b>Bio Statement:</b> <em>"${user.aboutMe || "No bio summary provided."}"</em></p>
                    <p><b>Intention Target:</b> ${user.goal || "N/A"}</p>
                    <p><b>Partner Preference Values:</b> ${user.preference || "N/A"}</p>
                    
                    <div style="margin-top:15px;">
                        <b>Verification Media Assets:</b>
                        <div style="display:flex; flex-wrap:wrap; margin-top:8px;">${imagesHtml}</div>
                    </div>

                    <div style="margin-top:20px; padding-top:15px; border-top:1px dashed #e2e8f0;">
                        <button onclick="runMatchEngine('${user._id}')" style="background:#0f172a; color:white; border:none; padding:10px 18px; border-radius:6px; font-weight:600; cursor:pointer;">
                            🤖 Run AI Pairing Logic
                        </button>
                        <div id="ai-output-${user._id}" style="margin-top:12px;"></div>
                    </div>
                </div>
            `;
        });

        usersDiv.innerHTML = html;
    } catch (err) {
        usersDiv.innerHTML = "<p style='color:#ef4444;'>Failed to stream system assets records smoothly.</p>";
    }
}

async function runMatchEngine(userId) {
    const outputBox = document.getElementById(`ai-output-${userId}`);
    outputBox.innerHTML = "<span style='color:#64748b; font-style:italic;'>Computing semantic intersections and matching scores...</span>";

    const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://localhost:3000"
        : window.location.origin;

    try {
        const response = await fetch(`${API_BASE_URL}/api/users/match/${userId}`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` }
        });
        const matches = await response.json();

        if (!matches || matches.length === 0) {
            outputBox.innerHTML = "<span style='color:#ef4444; font-weight:500;'>❌ No matching verified/paid profiles found in database constraints.</span>";
            return;
        }

        let matchHtml = `<div style="background:#f8fafc; padding:15px; border-radius:8px; border-left:4px solid #ff4d6d;"><b>🔥 Top AI Recommendations:</b><ul style="margin:5px 0 0 0; padding-left:20px;">`;
        matches.slice(0, 3).forEach(item => {
            matchHtml += `<li style="margin-bottom:4px;"><b>${item.user.fullName}</b> (${item.user.city}, ${item.user.country}) — <span style="color:#ff4d6d; font-weight:700;">${item.matchScore}% Score</span></li>`;
        });
        matchHtml += `</ul></div>`;
        outputBox.innerHTML = matchHtml;
    } catch (e) {
        outputBox.innerHTML = "<span style='color:#ef4444;'>AI Match Engine calculation process failed.</span>";
    }
}

function logoutAdmin() {
    localStorage.removeItem("adminToken");
    window.location.href = "login.html";
}

window.onload = loadUsers;