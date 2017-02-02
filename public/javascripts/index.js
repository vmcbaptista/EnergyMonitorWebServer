setInterval(updatePower, 1000);
function updatePower() {
    enerspectrum.setUrl("http://192.168.10.58:3000");
    enerspectrum.setDevice("common_room-35d864a6c6aedaf32848a1dc00e6c9d962478dc1f6a4925",
        "938cf5ebbbb69ec1ca07098326528ffc9a89db31fdc65454");
    enerspectrum('continuous_measuring')
        .query()
        .sort('-timestamp')
        .limit(1)
        .execute(dataReceived);
}

function dataReceived(err, data) {
    if (err) {
        console.log(err);
        return;
    }
    else {
        console.log(data);
        //Displays power values in the gauge
        Gauge.Collection.get('power_canvas_id').setValue(data[0].power);
        //Displays current values in the gauge
        Gauge.Collection.get('current_canvas_id').setValue(data[0].current);
    }
}

$().ready(function() {
    //Requests a calibration to the server
    $("#calibrate_button").click(function(){
        var calibrateButton = $(this);
        calibrateButton.text('Calibrating...');
        $.post("http://192.168.10.152/calibrate",function(){
            calibrateButton.text('Calibrate');
        })
            .fail(function() {
                calibrateButton.text( "Error" );
            })
    });

    $('#relay_button').click(function() {
        var button = $(this);
        $.post("http://192.168.10.152/relay",function(data){
            if (data === true) {
                button.text('Turn plug off');
                button.css('background-color', 'red');
            }
            else if (data === false) {
                button.text("Turn plug on");
                button.css('background-color', 'limegreen');
            }
        })
            .fail(function() {
                button.text( "Error" );
            })
    });

    //Sends to the server the value of the new selected mains voltage
    $("#voltage").change(function () {
        var value = $( "select option:selected" ).val();
        $.post("http://192.168.10.152/voltage/", {voltage: value}, function(data) {
            $('#actualVoltage').text(data);
        })
            .fail(function(){
                $('#actualVoltage').text("An error occurred");
            })
    });
});