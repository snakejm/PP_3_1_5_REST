"use strict";
$(document).ready(async function () {
    await getPrincipal();
    // todo hide admin button for user
    await getAllUsers();
    await editUser();
    await deleteUser();
    await showNewUserTab()
    await addNewUserButtonListener();
});

// Заполнение шапки
async function getPrincipal() {
    let principal = await fetch("http://localhost:8080/api/auth").then(response => response.json());
    document.getElementById("authEmail").innerHTML = `${principal.email}`;
    let roles = "";
    principal.roles.forEach(role => roles += role.noPrefix + " ");
    document.getElementById("authRoles").innerHTML = `${roles}`;
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
                    <tr id="user${user.id}">
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

async function getUser(id) {
    let url = "http://localhost:8080/api/users/" + id;
    let response = await fetch(url);
    return await response.json();
}

/*заполнение Edit modal*/
{
    $("#editModal").on("show.bs.modal", event => {
        let button = $(event.relatedTarget);
        let id = button.data("id");
        showEditModal(id);
    })

    async function showEditModal(id) {
        $("#editRolesUser").empty();
        let user = await getUser(id);
        let form = document.forms["formEditUser"];
        form.id.value = user.id;
        form.firstName.value = user.firstName;
        form.lastName.value = user.lastName;
        form.age.value = user.age;
        form.email.value = user.email;
        //todo form.password.value = user.password;

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
            })
    }
}

/*Edit user*/
async function editUser() {
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
{
    $("#deleteModal").on("show.bs.modal", event => {
        let button = $(event.relatedTarget);
        let id = button.data("id");
        showDeleteModal(id);
    })

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
        })
    }
}

/*Delete user*/
async function deleteUser() {
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