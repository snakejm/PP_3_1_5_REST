"use strict";
$(document).ready(async function () {
    let principal = await getPrincipal();
    let roleAdmin = false;
    principal.roles.forEach(role => role.noPrefix === "ADMIN" ? roleAdmin = true : {});
    if (roleAdmin) {
        await getAllUsers();
        await addEditUserButtonListener();
        await addDeleteUserButtonListener();
        await showNewUserTab()
        await addNewUserButtonListener();

        $("#editModal").on("show.bs.modal", event => {
            let button = $(event.relatedTarget);
            let id = button.data("id");
            showEditModal(id);
        })
        $("#deleteModal").on("show.bs.modal", event => {
            let button = $(event.relatedTarget);
            let id = button.data("id");
            showDeleteModal(id);
        })

    } else {
        $("#btnInfoPanel").click();
        $("#btnAdminPanel").hide();
        document.title = "User information-page";
    }

});

// Заполнение шапки и вкладки инфо
async function getPrincipal() {
    let principal = await fetch("http://localhost:8080/api/auth").then(response => response.json());
    $('#authEmail')[0].innerHTML = principal.email;
    let roles = "";
    principal.roles.forEach(role => roles += role.noPrefix + " ");
    $('#authRoles')[0].innerHTML = roles;
    $('#infoUserId')[0].innerHTML = principal.id;
    $('#infoUserFirstName')[0].innerHTML = principal.firstName;
    $('#infoUserLastName')[0].innerHTML = principal.lastName;
    $('#infoUserAge')[0].innerHTML = principal.age;
    $('#infoUserEmail')[0].innerHTML = principal.email;
    $('#infoUserRoles')[0].innerHTML = roles;
    return principal;
}

// Запросить данные пользователя по ID
async function getUser(id) {
    let response = await fetch(`http://localhost:8080/api/users/${id}`);
    return await response.json();
}

//заполнение таблицы всех пользователей
async function getAllUsers() {
    const tbody = $('#tbodyAdminTable');
    tbody.empty();
    await fetch("http://localhost:8080/api/users")
        .then(response => response.json())
        .then(data => {
            data.forEach(user => {
                let roles = "";
                user.roles.forEach(role => roles += role.noPrefix + " ");
                let rowUser = `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.firstName}</td>
                        <td>${user.lastName}</td>
                        <td>${user.age}</td>
                        <td>${user.email}</td>
                        <td>${roles}</td>
                        <td>
                            <button type="button" class="btn btn-info" data-bs-toggle="modal" id="buttonEdit" 
                            data-action="edit" data-id="${user.id}" data-bs-target="#editModal">Edit</button>
                        </td>
                        <td>
                            <button type="button" class="btn btn-danger" data-bs-toggle="modal" id="buttonDelete" 
                            data-action="delete" data-id="${user.id}" data-bs-target="#deleteModal">Delete</button>
                        </td>
                    </tr>`;
                tbody.append(rowUser);
            })
        });
}

/*заполнение Edit modal*/
async function showEditModal(id) {
    $("#editRolesUser").empty();
    let user = await getUser(id);
    let form = document.forms["formEditUser"];
    form.id.value = user.id;
    form.firstName.value = user.firstName;
    form.lastName.value = user.lastName;
    form.age.value = user.age;
    form.email.value = user.email;
    fetch("http://localhost:8080/api/roles")
        .then(response => response.json())
        .then(roles => {
            roles.forEach(role => {
                let selectedRole = false;
                for (let i = 0; i < user.roles.length; i++) {
                    if (user.roles[i].role === role.role) {
                        selectedRole = true;
                    }
                }
                let optionElement = document.createElement("option");
                optionElement.text = role.noPrefix;
                optionElement.value = role.id;
                if (selectedRole) optionElement.selected = true;
                document.getElementById("editRolesUser").appendChild(optionElement);
            })
        });
}


/*Edit user*/
async function addEditUserButtonListener() {
    const editForm = document.forms["formEditUser"];
    editForm.addEventListener("submit", event => {
        event.preventDefault();
        let editUserRoles = [];
        for (let i = 0; i < editForm.roles.options.length; i++) {
            if (editForm.roles.options[i].selected) {
                editUserRoles.push({
                    id: editForm.roles.options[i].value,
                    role: "ROLE_" + editForm.roles.options[i].text
                })
            }
        }

        fetch(`http://localhost:8080/api/users/${editForm.id.value}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: editForm.id.value,
                firstName: editForm.firstName.value,
                lastName: editForm.lastName.value,
                age: editForm.age.value,
                email: editForm.email.value,
                password: editForm.password.value,
                roles: editUserRoles
            })
        }).then(() => {
            $("#editFormCloseButton").click();
            getAllUsers();
        })
    })
}

/*заполнение Delete modal*/
async function showDeleteModal(id) {
    $("#deleteRolesUser").empty();
    let user = await getUser(id);
    let form = document.forms["formDeleteUser"];
    form.id.value = user.id;
    form.firstName.value = user.firstName;
    form.lastName.value = user.lastName;
    form.age.value = user.age;
    form.email.value = user.email;

    user.roles.forEach(role => {
        let optionElement = document.createElement("option");
        optionElement.text = role.noPrefix;
        optionElement.value = role.id;
        document.getElementById("deleteRolesUser").appendChild(optionElement);
    });
}


/*Delete user*/
async function addDeleteUserButtonListener() {
    const deleteForm = document.forms["formDeleteUser"];
    deleteForm.addEventListener("submit", event => {
        event.preventDefault();
        fetch(`http://localhost:8080/api/users/${deleteForm.id.value}`, {
            method: "DELETE"
        }).then(() => {
            $("#deleteFormCloseButton").click();
            getAllUsers();
        })
    })
}

/*Prepare new user roles*/
async function showNewUserTab() {
    let roles = await fetch("http://localhost:8080/api/roles")
        .then(response => response.json());
    for (let role of roles) {
        let optionElement = document.createElement("option");
        optionElement.text = role.noPrefix;
        optionElement.value = role.id;
        if (role.id === 2) {
            optionElement.selected = true;
        }
        document.getElementById("newUserRoles").appendChild(optionElement);
    }
}

/*Add new user*/
async function addNewUserButtonListener() {
    const newUserForm = document.forms["formNewUser"];
    newUserForm.addEventListener("submit", event => {
        event.preventDefault();
        let newUserRoles = [];
        console.log(newUserForm.roles.options);
        for (const option of newUserForm.roles.options) {
            if (option.selected) {
                newUserRoles.push({
                    id: option.value,
                    role: `ROLE_${option.text}`
                })
            }
        }
        fetch("http://localhost:8080/api/users", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: newUserForm.firstName.value,
                lastName: newUserForm.lastName.value,
                age: newUserForm.age.value,
                email: newUserForm.email.value,
                password: newUserForm.password.value,
                roles: newUserRoles
            })
        }).then(() => {
            newUserForm.reset();
            getAllUsers();
            $("#navLinkAllUsersPanel").click();
        });
    })
}