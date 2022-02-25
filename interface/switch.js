$(".tab").click(function() 
{
    if($(this).hasClass("active"))
    {
        return;
    }
    
    $(".tab.active").removeClass("active");
    $(this).addClass("active");

    var page = $(this).html().toLowerCase();
    
    $(".page.active").removeClass("active");
    $(`#${page}`).addClass("active");
});