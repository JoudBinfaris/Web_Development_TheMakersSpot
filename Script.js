let dark = false;

function applyTheme(theme) {
    // to override css rules 
    var h1s   = document.getElementsByTagName("h1");
    var h2s   = document.getElementsByTagName("h2");
    var h3s   = document.getElementsByTagName("h3");
    var h4s   = document.getElementsByTagName("h4"); // <-- FIXED NAME
    var ps    = document.getElementsByTagName("p");
    var links = document.getElementsByTagName("a");

    if (theme === "light") {
        // ALT THEME
        document.body.style.backgroundColor = "#fff9ea";
        document.body.style.color = "#000000";

        for (var i = 0; i < h1s.length; i++) h1s[i].style.color = "#000000";
        for (var i = 0; i < h2s.length; i++) h2s[i].style.color = "#000000";
        for (var i = 0; i < h3s.length; i++) h3s[i].style.color = "#000000";
        for (var i = 0; i < h4s.length; i++) h4s[i].style.color = "#000000";
        for (var i = 0; i < ps.length;  i++) ps[i].style.color  = "#000000";
        for (var i = 0; i < links.length; i++) links[i].style.color = "#000000";

        dark = true;
    } else {
        // BACK TO ORIGINAL CSS
        document.body.style.backgroundColor = "";
        document.body.style.color = "";

        for (var i = 0; i < h1s.length; i++) h1s[i].style.color = "";
        for (var i = 0; i < h2s.length; i++) h2s[i].style.color = "";
        for (var i = 0; i < h3s.length; i++) h3s[i].style.color = "";
        for (var i = 0; i < h4s.length; i++) h4s[i].style.color = "";
        for (var i = 0; i < ps.length;  i++) ps[i].style.color  = "";
        for (var i = 0; i < links.length; i++) links[i].style.color = "";

        dark = false;
    }
}

function switchTheme() {
    // if we are in alt theme (dark==true) → go back to "default"
    // if in default (dark==false) → go to "light"
    const newTheme = dark ? "default" : "light";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
}

// Apply theme on page load (ONLY if last saved is "light")
let savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
    applyTheme("light");
}





document.addEventListener("DOMContentLoaded", () => {

  

    const addForm = document.getElementById("aw-form");

    if (addForm) {
        addForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("wname").value.trim();
            const price = document.getElementById("wprice").value.trim();
            const photo = document.getElementById("wphoto").value.trim();
            const desc = document.getElementById("wdesc").value.trim();

            // --- Validation with specific alerts ---
            if (!name) {
                alert("Please enter the workshop name.");
                return;
            }

            if (!isNaN(name[0])) {
                alert("The workshop name cannot start with a number.");
                return;
            }

            if (!price) {
                alert("Please enter the workshop price.");
                return;
            }

            if (isNaN(price)) {
                alert("Price must be a number.");
                return;
            }

            if (!photo) {
                alert("Please select a workshop photo.");
                return;
            }

            if (!desc) {
                alert("Please enter the workshop description.");
                return;
            }

            // --- Load existing workshops from localStorage ---
            let workshops = JSON.parse(localStorage.getItem("workshops")) || [];

            // --- Create new workshop object ---
            const newWorkshop = {
                name: name,
                price: price,
                photo: photo,
                description: desc
            };

            // --- Save back to localStorage (array of objects) ---
            workshops.push(newWorkshop);
            localStorage.setItem("workshops", JSON.stringify(workshops));

            // --- Success alert with the name of the new service ---
            alert(`Workshop "${name}" has been added successfully!`);

            // --- Clear the form ---
            addForm.reset();
        });
    }

    // ====================================
    //  CRAFT MANAGER DASHBOARD PAGE
    // ====================================

    const workshopsContainer = document.getElementById("workshopsContainer");

    if (workshopsContainer) {
        const workshops = JSON.parse(localStorage.getItem("workshops")) || [];

        if (workshops.length === 0) {
            workshopsContainer.innerHTML = `<p>No workshops added yet.</p>`;
        } else {
            workshopsContainer.innerHTML = "";
            workshops.forEach(ws => {
                const card = document.createElement("div");
                card.classList.add("workshop-desc");

                card.innerHTML = `
                    <div class="workshop-img">
                        <img src="${ws.photo}" alt="${ws.name}" width="200">
                    </div>
                    <h3>${ws.name}</h3>
                    <p>Description: ${ws.description}</p>
                    <p>Price: ${ws.price}SAR</p>
                `;

                workshopsContainer.appendChild(card);
            });
        }
    }

    // =============================
    //  MANAGE STAFF PAGE 
    // =============================

    const staffList = document.getElementById("staffList");
    const deleteForm = document.getElementById("Deletestaff");
    const addStaffForm = document.getElementById("Addstaff");

    // ------------ DISPLAY STAFF ------------
    if (staffList) {
        let staff = JSON.parse(localStorage.getItem("staff")) || [];

        if (staff.length === 0) {
            staffList.innerHTML = `<p>No staff members added yet.</p>`;
        } else {
            staffList.innerHTML = "";
            staff.forEach((member, index) => {
                const item = document.createElement("label");
                item.classList.add("ms-staff-item");

                item.innerHTML = `
                    <img src="${member.photo}" alt="Employee">
                    <span>${member.name}</span>
                    <input type="checkbox" class="staff-checkbox" value="${index}">
                `;
                staffList.appendChild(item);
            });
        }
    }

    // ------------ DELETE STAFF ------------
    if (deleteForm) {
        deleteForm.addEventListener("submit", function (e) {
            e.preventDefault();

            let staff = JSON.parse(localStorage.getItem("staff")) || [];
            const checkboxes = document.querySelectorAll(".staff-checkbox:checked");

            if (checkboxes.length === 0) {
                alert("Please select at least one staff member to delete.");
                return;
            }

            if (!confirm("Are you sure you want to delete selected staff members?")) {
                return;
            }

            const indexesToDelete = Array.from(checkboxes).map(cb => Number(cb.value));

            staff = staff.filter((_, idx) => !indexesToDelete.includes(idx));

            localStorage.setItem("staff", JSON.stringify(staff));

            alert("Selected staff members have been deleted.");
            location.reload();
        });
    }

    // ------------ ADD STAFF ------------
    if (addStaffForm) {
        addStaffForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("msName").value.trim();
            const photo = document.getElementById("msPhoto").value.trim();
            const email = document.getElementById("msEmail").value.trim();
            const expertise = document.getElementById("msExpertise").value.trim();
            const dob = document.getElementById("msDob").value;
            const skills = document.getElementById("msSkills").value.trim();
            const education = document.getElementById("msEducation").value.trim();

            // VALIDATION
            if (!name) {
                alert("Please enter a name.");
                return;
            }

            if (!isNaN(name[0])) {
                alert("Name cannot start with a number.");
                return;
            }

            if (!photo) {
                alert("Please select a photo.");
                return;
            }

            if (!email) {
                alert("Please enter an email.");
                return;
            }

            if (!email.includes("@") || !email.includes(".")) {
                alert("Please enter a valid email address.");
                return;
            }

            if (!expertise) {
                alert("Please enter expertise.");
                return;
            }

            if (!dob) {
                alert("Please enter date of birth.");
                return;
            }

            if (!skills) {
                alert("Please enter skills.");
                return;
            }

            if (!education) {
                alert("Please enter education.");
                return;
            }

            let staff = JSON.parse(localStorage.getItem("staff")) || [];

            const newStaff = {
                name,
                photo,
                email,
                expertise,
                dob,
                skills,
                education
            };

            staff.push(newStaff);
            localStorage.setItem("staff", JSON.stringify(staff));

            alert(`Staff member "${name}" added successfully!`);
            addStaffForm.reset();
            location.reload();
        });
    }
  

});

