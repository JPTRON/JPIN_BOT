const socket = io();

var mediaPlaying = false;

socket.on("video", function(media) {
    if(mediaPlaying)
    {
        return;
    }

    mediaPlaying = true;

    var video = document.getElementById("videos");

    $("#videos").attr("src",`/media/${media}`).fadeOut(1).fadeIn("slow");
    video.preload = "metadata";
    video.play();

    $(video).on("ended", function(){
        $("#videos").delay(2000).fadeOut("slow"); 
        mediaPlaying = false;
    });
});

socket.on("sound", function(media) {
    if(mediaPlaying)
    {
        return;
    }

    mediaPlaying = true;

    var audio = new Audio(`/media/${media}`);

    audio.preload = "metadata";
    audio.play();
    
    $(audio).on("loadedmetadata", function(){
    setTimeout(function(){ mediaPlaying = false; }, (audio.duration + 2000));
    });
});

socket.on("image", function(media) {
    if(mediaPlaying)
    {
        return;
    }   

    mediaPlaying = true;
    $("#image").attr("src",`/media/${media}`).fadeOut(1).fadeIn("slow").delay(3000).fadeOut("slow");

    setTimeout(function(){ 
        mediaPlaying = false; 
        $("#image").removeAttr("src");
    }, 5000);
});