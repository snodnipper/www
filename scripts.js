document.addEventListener("DOMContentLoaded", function() {

    function colorDistance(pixel, color) {
        let dr = pixel.r - color.r;
        let dg = pixel.g - color.g;
        let db = pixel.b - color.b;
        return dr*dr + dg*dg + db*db;
    }

    function hexToRgb(hex) {
        let bigint = parseInt(hex.slice(1), 16);
        let r = (bigint >> 16) & 255;
        let g = (bigint >> 8) & 255;
        let b = bigint & 255;
        return { r, g, b };
    }

    function getBrightestDominantColor(img) {
        let canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
    
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
    
        let data = ctx.getImageData(0, 0, img.width, img.height).data;
    
        let neonColors = [
            { name: "blue great", color: hexToRgb("#56F1FF") },
            { name: "blue ok", color: hexToRgb("#2Ac9F9") },
            { name: "purple ok", color: hexToRgb("#BF4BF8") },
            { name: "purple so so", color: hexToRgb("#D34DEE") },
            { name: "pink ok", color: hexToRgb("#FF5BFF") },
            { name: "dark pink", color: hexToRgb("#EE018F") },
            { name: "blue darker", color: hexToRgb("#41FEFF") },
            { name: "baby blue", color: hexToRgb("#BFFFFC") },
            { name: "aqua", color: hexToRgb("#02FEE4") },
            { name: "orange", color: hexToRgb("#FF9535") },
            { name: "organic green", color: hexToRgb("#8DFF0A") },
            { name: "yellow", color: hexToRgb("#FFEF06") },
            { name: "deep orange", color: hexToRgb("#FC5E31") },
            { name: "baby yellow", color: hexToRgb("#FFFDBB") },
            { name: "aqua 2", color: hexToRgb("#53E8D4") },
            { name: "neon magenta", color: hexToRgb("#FE39A4") },
            { name: "sky blue", color: hexToRgb("#25C4F8") },
            { name: "pop pink", color: hexToRgb("#FB41DA") },
            { name: "pop yellow", color: hexToRgb("#FFFE13") },
            { name: "pop green", color: hexToRgb("#55FC77") },
            { name: "night blue", color: hexToRgb("#55FC77") }, // This has the same value as "pop green"
            { name: "aqua3", color: hexToRgb("#84F5D5") },
            { name: "dirty yellow", color: hexToRgb("#F2E85C") },
            { name: "toxic green", color: hexToRgb("#8AFF00") },
            { name: "shop yellow", color: hexToRgb("#FFDD00") },
            { name: "shop green", color: hexToRgb("#24FD36") },
            { name: "shop blue", color: hexToRgb("#64F7F3") },
            { name: "butterfly blue", color: hexToRgb("#B6FFFE") },
            { name: "butterfly blue", color: hexToRgb("#48FDFE") }, // This seems to be a duplicate name
            { name: "sign blue", color: hexToRgb("#0FE6FF") },
            { name: "sign yellow", color: hexToRgb("#FFEB0A") },
            { name: "pacman orange", color: hexToRgb("#FF8800") },
            { name: "pacman yellow", color: hexToRgb("#EFFE01") },
            { name: "pacman green", color: hexToRgb("#9BFE01") },
            { name: "pacman blue", color: hexToRgb("#00ECFF") },
            { name: "pacman pink", color: hexToRgb("#FF00C2") }
        ];

        let colorCounts = {};
    
        for (let color of neonColors) {
            colorCounts[color.name] = 0;
        }
    
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];
    
            for (let neonColor of neonColors) {
                let distance = colorDistance({ r, g, b }, neonColor.color);
                if (distance < 65025) {
                    colorCounts[neonColor.name] += (65025 - distance) / 65025;
                }
            }
        }
    
        let mostFrequentNeonName = Object.keys(colorCounts).reduce((a, b) => colorCounts[a] > colorCounts[b] ? a : b);
        let mostFrequentNeonColor = neonColors.find(neon => neon.name === mostFrequentNeonName).color;
        return `rgb(${mostFrequentNeonColor.r}, ${mostFrequentNeonColor.g}, ${mostFrequentNeonColor.b})`;
    }

    function applyAccentColor(color) {
        let matches = color.match(/(\d+), (\d+), (\d+)/);
        let r = matches[1];
        let g = matches[2];
        let b = matches[3];
        
        let rgbaString = `rgba(${r}, ${g}, ${b}, 0.2)`;
        document.documentElement.style.setProperty('--accent-color', color);
        document.documentElement.style.setProperty('--accent-color-rgba', rgbaString);
    }

    function getRandomBanner() {
        let banners = [
            'banner1.jpg', 'banner2.jpg', 'banner3.jpg',
            'banner4.jpg', 'banner5.jpg', 'banner6.jpg',
            'banner7.jpg', 'banner8.jpg'
        ];
        return banners[Math.floor(Math.random() * banners.length)];
    }

    function setBanner() {
        let newBannerSrc = 'media/' + getRandomBanner();
        let imageLoader = new Image();
        imageLoader.src = newBannerSrc;
    
        imageLoader.onload = function() {
            let dominantColor = getBrightestDominantColor(imageLoader);
            applyAccentColor(dominantColor);
            document.getElementById('banner').src = newBannerSrc;
        }
    }    

    function setBannerRotation() {
        if (debug) {
            setBanner();
            setInterval(setBanner, 5000);
        } else {
            let secondsUntilNextMinute = 60 - new Date().getSeconds();
            setTimeout(() => {
                setBanner();
                setInterval(setBanner, 60000);
            }, secondsUntilNextMinute * 1000);
        }
    }    

    var debug = true;
    setBannerRotation();
});
