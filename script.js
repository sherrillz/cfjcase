const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const revealTargets = document.querySelectorAll(".section, .timeline-item, .status-card, .step-item, .contact-block");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxClose = document.querySelector(".lightbox-close");
const zoomableImages = document.querySelectorAll(".zoomable-image");
const impactMap = document.querySelector("#impact-map");
const urlParams = new URLSearchParams(window.location.search);

if (urlParams.get("long") === "1") {
  document.body.classList.add("long-mode");
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal", "is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12
  }
);

revealTargets.forEach((element) => {
  element.classList.add("reveal");
  observer.observe(element);
});

if (impactMap) {
  const provinceData = [
    { name: "广东", amount: 14592.21, victims: 98 },
    { name: "上海", amount: 14074.95, victims: 59 },
    { name: "江苏", amount: 12204.64, victims: 66 },
    { name: "北京", amount: 9166.19, victims: 44 },
    { name: "湖北", amount: 7866.85, victims: 31 },
    { name: "浙江", amount: 7016.69, victims: 42 },
    { name: "山东", amount: 6922.28, victims: 41 },
    { name: "四川", amount: 4970.25, victims: 34 },
    { name: "福建", amount: 4922.72, victims: 34 },
    { name: "河南", amount: 4719.01, victims: 25 },
    { name: "安徽", amount: 4015.61, victims: 31 },
    { name: "湖南", amount: 3346.73, victims: 22 },
    { name: "广西", amount: 3153.22, victims: 25 },
    { name: "重庆", amount: 2796.97, victims: 14 },
    { name: "天津", amount: 2279.00, victims: 18 },
    { name: "辽宁", amount: 1851.36, victims: 14 },
    { name: "江西", amount: 1733.96, victims: 13 },
    { name: "吉林", amount: 1579.60, victims: 8 },
    { name: "河北", amount: 1325.88, victims: 11 },
    { name: "黑龙江", amount: 1202.53, victims: 5 },
    { name: "贵州", amount: 1185.48, victims: 8 },
    { name: "云南", amount: 809.00, victims: 2 },
    { name: "山西", amount: 737.41, victims: 4 },
    { name: "陕西", amount: 723.48, victims: 7 },
    { name: "甘肃", amount: 379.86, victims: 1 },
    { name: "新疆", amount: 226.10, victims: 4 }
  ];

  const provinceCenters = {
    广东: [113.26653, 23.132191],
    上海: [121.473701, 31.230416],
    江苏: [118.796877, 32.060255],
    北京: [116.407526, 39.90403],
    湖北: [114.305393, 30.593099],
    浙江: [120.153576, 30.287459],
    山东: [117.120128, 36.6512],
    四川: [104.066541, 30.572269],
    福建: [119.296494, 26.074508],
    河南: [113.625368, 34.7466],
    安徽: [117.227239, 31.820587],
    湖南: [112.938814, 28.228209],
    广西: [108.327546, 22.815478],
    重庆: [106.551557, 29.56301],
    天津: [117.200983, 39.084158],
    辽宁: [123.42944, 41.835441],
    江西: [115.858198, 28.682892],
    吉林: [125.323544, 43.817071],
    河北: [114.514859, 38.042307],
    黑龙江: [126.642464, 45.756967],
    贵州: [106.630153, 26.647661],
    云南: [102.712251, 25.040609],
    山西: [112.549248, 37.857014],
    陕西: [108.948024, 34.263161],
    甘肃: [103.834304, 36.061089],
    新疆: [87.617733, 43.792818]
  };

  const maxAmount = Math.max(...provinceData.map((item) => item.amount));
  const minAmount = Math.min(...provinceData.map((item) => item.amount));
  const maxVictims = Math.max(...provinceData.map((item) => item.victims));
  const chart = echarts && window.echarts ? window.echarts.init(impactMap, null, { renderer: "canvas" }) : null;

  if (!chart) {
    impactMap.innerHTML = "<p style='padding:2rem;color:#5d544a;'>地图组件加载失败，请刷新页面重试。</p>";
  } else {
    const scatterData = provinceData
      .filter((item) => provinceCenters[item.name])
      .map((item) => ({
        name: item.name,
        value: [...provinceCenters[item.name], item.victims, item.amount]
      }));

    const option = {
      animationDuration: 900,
      tooltip: {
        trigger: "item",
        formatter: (params) => {
          if (params.seriesType === "scatter") {
            const [lng, lat, victims, amount] = params.value;
            return `${params.name}<br>${victims}人<br>${amount.toFixed(2)}元`;
          }
          const data = params.data;
          if (data && typeof data.value === "number") {
            const matched = provinceData.find((item) => item.name === params.name);
            return `${params.name}<br>${matched ? `${matched.victims}人<br>` : ""}${data.value.toFixed(2)}元`;
          }
          return params.name;
        }
      },
      visualMap: {
        min: minAmount,
        max: maxAmount,
        calculable: false,
        orient: "horizontal",
        left: "center",
        bottom: 18,
        text: ["高金额", "低金额"],
        textStyle: {
          color: "#5d544a"
        },
        inRange: {
          color: ["#f3d8cf", "#d78d78", "#9e3928"]
        }
      },
      geo: {
        map: "china",
        roam: false,
        zoom: 1.05,
        label: {
          show: false
        },
        itemStyle: {
          areaColor: "#f5e9de",
          borderColor: "rgba(126, 72, 58, 0.35)",
          borderWidth: 1
        },
        emphasis: {
          label: {
            show: false
          },
          itemStyle: {
            areaColor: "#d88d78"
          }
        }
      },
      series: [
        {
          type: "map",
          map: "china",
          geoIndex: 0,
          data: provinceData.map((item) => ({
            name: item.name,
            value: item.amount
          })),
          label: {
            show: false
          }
        },
        {
          type: "scatter",
          coordinateSystem: "geo",
          data: scatterData,
          symbolSize: (value) => {
            const victims = value[2];
            return 18 + (victims / maxVictims) * 46;
          },
          itemStyle: {
            color: "rgba(165, 62, 43, 0.75)",
            borderColor: "rgba(255,255,255,0.92)",
            borderWidth: 2,
            shadowBlur: 18,
            shadowColor: "rgba(165, 62, 43, 0.25)"
          },
          label: {
            show: true,
            color: "#ffffff",
            fontWeight: 800,
            fontSize: 11,
            formatter: ({ value }) => `${value[2]}人`
          },
          emphasis: {
            scale: true,
            label: {
              show: true
            }
          },
          zlevel: 3
        }
      ]
    };

    chart.setOption(option);
    window.addEventListener("resize", () => chart.resize());
  };
}

if (lightbox && lightboxImage && lightboxClose) {
  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
    lightboxImage.src = "";
    lightboxImage.alt = "";
  };

  zoomableImages.forEach((image) => {
    image.addEventListener("click", () => {
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("menu-open");
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
}
