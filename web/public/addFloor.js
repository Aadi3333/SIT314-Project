$(document).ready(function () {
    $('#addFloor').click(function () {
        const floorName = $('#floorName').val();
        $.post(`${API_URL}/addFloor`, { name: floorName })
            .done(function (data) {
                console.log('Floor added successfully', data);

                // Fetch and display floors on the home page after adding a new floor
                fetchAndDisplayFloors();

                // Navigate back to the home page
                location.href = `${SERVER_URL}/home`;
            })
            .fail(function (error) {
                console.log('Error adding floor', error);
            });
    });
});
