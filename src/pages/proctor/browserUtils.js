export const getBrowserAndOS = () => {
    const userAgent = window.navigator.userAgent;
    const userAgentData = navigator.userAgentData || null;

    let browser = "Unknown";

    if (userAgentData && userAgentData.brands) {
        const brands = userAgentData.brands.map(b => b.brand);

        if (brands.includes("Brave")) browser = "Brave";
        else if (brands.includes("Microsoft Edge")) browser = "Edge";
        else if (brands.includes("Opera") || brands.includes("OPR")) browser = "Opera";
        else if (brands.includes("Samsung Internet")) browser = "Samsung Internet";
        else if (brands.includes("Vivaldi")) browser = "Vivaldi";
        else if (brands.includes("Google Chrome")) browser = "Chrome";
    } 
    else {
        if (/Edg/.test(userAgent)) browser = "Edge";
        else if (/OPR|Opera/.test(userAgent)) browser = "Opera";
        else if (/SamsungBrowser/.test(userAgent)) browser = "Samsung Internet";
        else if (/Vivaldi/.test(userAgent)) browser = "Vivaldi";
        else if (/Firefox/.test(userAgent)) browser = "Firefox";
        else if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) browser = "Safari";
        else if (/Trident|MSIE/.test(userAgent)) browser = "Internet Explorer";
        else if (/Chrome/.test(userAgent)) browser = "Chrome";
    }

    const os = /Windows/.test(userAgent) ? "Windows" :
        /Mac OS X/.test(userAgent) ? "Mac OS X" :
        /Linux/.test(userAgent) ? "Linux" :
        /Android/.test(userAgent) ? "Android" :
        /iOS/.test(userAgent) ? "iOS" :
        "Unknown";

    return { browser, os };
};