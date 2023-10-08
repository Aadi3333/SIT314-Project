// BUILDING LEVEL - VIEW FLOORS

// Function to fetch and display floors
function fetchAndDisplayFloors() {
    $.get(`${API_URL}/viewFloors`)
        .then(response => {
            $('#floorTable tbody').empty(); // Clear existing rows
            for (let index = response.length - 1; index >= 0; index--) {
                const floor = response[index];
                $('#floorTable tbody').append(`
                    <tr>
                        <td>
                            <br>
                            <button class="floorControlButton"
                                onclick="goToFloor('${floor.name}')">${floor.name}</button>
                            <br>
                            <button class="editButton"
                                onclick="getUserFloorEdit('${floor._id}')">Edit</button>
                            <button class="deleteButton"
                                onclick="deleteFloor('${floor._id}')">Delete</button>
                        </td>
                    </tr>`
                );
            }
        });
}

// Call the function to fetch and display floors when the page loads
$(document).ready(function () {
    fetchAndDisplayFloors();
});
