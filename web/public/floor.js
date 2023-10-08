// Get the selected floor name from local storage
const currentFloor = localStorage.getItem('floorName');

// Append floor name to top of room table - identifying current floor
$('#roomTable thead').append(
    `<h2> ${currentFloor} Floor - Rooms</h2>`
);

// Append a table of rooms on a floor
$.get(`${API_URL}/viewRooms/${currentFloor}`)
.then(response => {
    response.forEach(room => {
        $('#roomTable tbody').append(`
            <tr>
                <td>
                <br>
                    <button class="roomControlButton"
                    onclick="goToRoom('${room.name}')">${room.name}</button>
                <br>
                    <button class="editButton"
                    onclick="getUserRoomEdit('${room._id}')">Edit</button>
                    <button class="deleteButton"
                    onclick="deleteRoom('${room._id}')">Delete</button>
                </td>
            </tr>`
        );
    });
});

// Go to a selected room
function goToRoom(roomName){
    localStorage.setItem('roomName', roomName);
    location.href = `${SERVER_URL}/room`;
}

function getUserRoomEdit(mongo_id){
    document.getElementById("editRoomForm").style.display="block";
    localStorage.setItem('mongo_id',mongo_id);
}

function editRoomName(){
    const mongo_id = localStorage.getItem('mongo_id');
    const name = $('#newRoomName').val();
    $.ajax({
        url: `${API_URL}/room/${mongo_id}/update`,
        type: 'PUT',
        contentType: "application/json; charset=utf-8",
        traditional: true,
        data: JSON.stringify({"name":name}),
        success: function(response) {
            localStorage.setItem('log', JSON.stringify(response));
            location.href = `${SERVER_URL}/floor`;
        },
        error: function(response) {
            localStorage.setItem('log', JSON.stringify(response));
            location.href = `${SERVER_URL}/floor`;
        }
    });
}

// DELETE ROOM
async function deleteRoom(mongo_id) {
    const deletion = await $.ajax({
        url: `${API_URL}/deleteRoom/${mongo_id}`,
        type: 'DELETE',
        success: function (result) {
            console.log('Room Delete Successful', result);
            location.reload();
        },
        error: function (result) {
            console.log('Room Delete Error', result);
            location.reload();
        }
    });
}