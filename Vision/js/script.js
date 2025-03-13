// Initialize Particles.js
document.addEventListener("DOMContentLoaded", () => {
  if (typeof particlesJS !== "undefined") {
    particlesJS("particles-js", {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: "#ffffff",
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000",
          },
          polygon: {
            nb_sides: 5,
          },
        },
        opacity: {
          value: 0.3,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: true,
            speed: 2,
            size_min: 0.1,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#ffffff",
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "bubble",
          },
          onclick: {
            enable: true,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 1,
            },
          },
          bubble: {
            distance: 200,
            size: 6,
            duration: 2,
            opacity: 0.8,
            speed: 3,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
          push: {
            particles_nb: 4,
          },
          remove: {
            particles_nb: 2,
          },
        },
      },
      retina_detect: true,
    })
  }
})

// Custom cursor
const cursor = document.querySelector(".vision-cursor")
const cursorRing = document.querySelector(".vision-cursor-ring")
let cursorX = 0
let cursorY = 0
let targetX = 0
let targetY = 0
let ringX = 0
let ringY = 0

document.addEventListener("mousemove", (e) => {
  targetX = e.clientX
  targetY = e.clientY
})

function updateCursor() {
  const dx = targetX - cursorX
  const dy = targetY - cursorY

  cursorX += dx * 0.2
  cursorY += dy * 0.2

  cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`

  const dxRing = targetX - ringX
  const dyRing = targetY - ringY

  ringX += dxRing * 0.1
  ringY += dyRing * 0.1

  cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`

  requestAnimationFrame(updateCursor)
}

updateCursor()

// Mouse down/up effects
document.addEventListener("mousedown", () => {
  cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) scale(0.7)`
  cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) scale(1.2)`
})

document.addEventListener("mouseup", () => {
  cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) scale(1)`
  cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) scale(1)`
})

// Clock
function updateClock() {
  const now = new Date()
  let hours = now.getHours()
  const minutes = now.getMinutes().toString().padStart(2, "0")
  const ampm = hours >= 12 ? "PM" : "AM"

  hours = hours % 12
  hours = hours ? hours : 12 // Convert 0 to 12

  document.querySelector(".clock").textContent = `${hours}:${minutes} ${ampm}`
}

updateClock()
setInterval(updateClock, 1000)

// App functionality
const appGrid = document.getElementById("appGrid")
const appWindows = document.getElementById("appWindows")
const homeButton = document.getElementById("homeButton")
const appIcons = document.querySelectorAll(".app-icon")

let activeApp = null
let zIndex = 10

// Templates
const safariAppTemplate = document.getElementById("safariAppTemplate")
const photosAppTemplate = document.getElementById("photosAppTemplate")
const settingsAppTemplate = document.getElementById("settingsAppTemplate")
const calendarAppTemplate = document.getElementById("calendarAppTemplate")
const genericAppTemplate = document.getElementById("genericAppTemplate")

// Open app function
function openApp(appId) {
  // Create app window
  const appWindow = document.createElement("div")
  appWindow.className = "app-window"
  appWindow.dataset.appId = appId
  appWindow.style.zIndex = zIndex++

  // Add opening animation
  appWindow.style.opacity = "0"
  appWindow.style.transform = "translate(-50%, -50%) scale(0.9)"
  setTimeout(() => {
    appWindow.style.opacity = "1"
    appWindow.style.transform = "translate(-50%, -50%) scale(1)"
  }, 10)

  // Create app window header
  const appWindowHeader = document.createElement("div")
  appWindowHeader.className = "app-window-header"

  const appWindowTitle = document.createElement("div")
  appWindowTitle.className = "app-window-title"
  appWindowTitle.textContent = appId.charAt(0).toUpperCase() + appId.slice(1)

  const appWindowClose = document.createElement("button")
  appWindowClose.className = "app-window-close"
  appWindowClose.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  `

  appWindowHeader.appendChild(appWindowTitle)
  appWindowHeader.appendChild(appWindowClose)

  appWindow.appendChild(appWindowHeader)

  // Add app content based on app ID
  let template
  switch (appId) {
    case "safari":
      template = safariAppTemplate
      break
    case "photos":
      template = photosAppTemplate
      break
    case "settings":
      template = settingsAppTemplate
      break
    case "calendar":
      template = calendarAppTemplate
      break
    default:
      template = genericAppTemplate
  }

  const content = template.content.cloneNode(true)
  appWindow.appendChild(content)

  // Add to DOM
  appWindows.appendChild(appWindow)

  // Make draggable
  makeDraggable(appWindow)

  // Add event listeners
  appWindowClose.addEventListener("click", () => {
    closeApp(appWindow)
  })

  // Set as active app
  activeApp = appWindow

  // Hide app grid with animation
  appGrid.style.transition = "opacity 0.3s ease, transform 0.3s ease"
  appGrid.style.opacity = "0"
  appGrid.style.transform = "scale(0.95)"
  appGrid.style.pointerEvents = "none"

  return appWindow
}

// Close app function
function closeApp(appWindow) {
  // Add closing animation
  appWindow.style.transition = "opacity 0.3s ease, transform 0.3s ease"
  appWindow.style.opacity = "0"
  appWindow.style.transform = "translate(-50%, -50%) scale(0.9)"

  setTimeout(() => {
    appWindow.remove()

    // If no more apps, show app grid
    if (appWindows.children.length === 0) {
      appGrid.style.opacity = "1"
      appGrid.style.transform = "scale(1)"
      appGrid.style.pointerEvents = "auto"
      activeApp = null
    } else {
      // Set the last app as active
      activeApp = appWindows.children[appWindows.children.length - 1]
    }
  }, 300)
}

// Make element draggable
function makeDraggable(element) {
  const header = element.querySelector(".app-window-header")

  let isDragging = false
  let offsetX, offsetY
  let initialX, initialY
  let rotateX = 0,
    rotateY = 0

  header.addEventListener("mousedown", (e) => {
    isDragging = true
    const rect = element.getBoundingClientRect()
    offsetX = e.clientX - rect.left
    offsetY = e.clientY - rect.top
    initialX = rect.left
    initialY = rect.top

    // Bring to front
    element.style.zIndex = zIndex++
    activeApp = element

    // Add active class for styling
    element.classList.add("active")
  })

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return

    const x = e.clientX - offsetX
    const y = e.clientY - offsetY

    // Calculate rotation based on movement
    rotateX = (e.clientY - (initialY + offsetY)) * 0.1
    rotateY = (initialX + offsetX - e.clientX) * 0.1

    // Limit rotation
    rotateX = Math.max(-10, Math.min(10, rotateX))
    rotateY = Math.max(-10, Math.min(10, rotateY))

    element.style.transform = `translate(${x}px, ${y}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    element.style.top = "0"
    element.style.left = "0"
  })

  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false

      // Smoothly reset rotation
      setTimeout(() => {
        element.style.transition = "transform 0.5s ease"
        element.style.transform = element.style.transform.replace(
          /rotateX$$[^)]+$$ rotateY$$[^)]+$$/,
          "rotateX(0deg) rotateY(0deg)",
        )

        // Remove transition after animation completes
        setTimeout(() => {
          element.style.transition = ""
        }, 500)
      }, 100)
    }
  })

  // Focus on click
  element.addEventListener("mousedown", () => {
    element.style.zIndex = zIndex++
    activeApp = element

    // Remove active class from all windows
    document.querySelectorAll(".app-window").forEach((win) => {
      win.classList.remove("active")
    })

    // Add active class to current window
    element.classList.add("active")
  })
}

// App icon click event
appIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    const appId = icon.dataset.app
    openApp(appId)
  })

  // Add hover effect
  icon.addEventListener("mouseenter", () => {
    cursorRing.style.width = "40px"
    cursorRing.style.height = "40px"
  })

  icon.addEventListener("mouseleave", () => {
    cursorRing.style.width = "30px"
    cursorRing.style.height = "30px"
  })
})

// Home button click event
homeButton.addEventListener("click", () => {
  // Close all apps with animation
  const apps = Array.from(appWindows.children)

  apps.forEach((app, index) => {
    setTimeout(() => {
      closeApp(app)
    }, index * 100)
  })

  // Show app grid with animation
  setTimeout(() => {
    appGrid.style.opacity = "1"
    appGrid.style.transform = "scale(1)"
    appGrid.style.pointerEvents = "auto"
    activeApp = null
  }, apps.length * 100)
})

// Toggle switches in settings
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("toggle-switch")) {
    e.target.classList.toggle("active")
  }
})

// Initialize volume slider
const volumeSlider = document.getElementById("volumeSlider")
volumeSlider.addEventListener("input", (e) => {
  // In a real app, this would control the volume
  console.log(`Volume set to ${e.target.value}%`)
})

// Add 3D perspective effect on mouse move
document.addEventListener("mousemove", (e) => {
  const xAxis = (window.innerWidth / 2 - e.pageX) / 25
  const yAxis = (window.innerHeight / 2 - e.pageY) / 25

  // Apply subtle rotation to app icons
  appIcons.forEach((icon) => {
    icon.style.transform = `rotateY(${xAxis}deg) rotateX(${-yAxis}deg) translateZ(0)`
  })

  // Apply subtle rotation to active app window if not being dragged
  if (activeApp && !activeApp.classList.contains("dragging")) {
    activeApp.style.transform = `translate(-50%, -50%) rotateY(${xAxis / 5}deg) rotateX(${-yAxis / 5}deg)`
  }
})

// Add hover effects for buttons
const allButtons = document.querySelectorAll("button")
allButtons.forEach((button) => {
  button.addEventListener("mouseenter", () => {
    cursorRing.style.width = "40px"
    cursorRing.style.height = "40px"
  })

  button.addEventListener("mouseleave", () => {
    cursorRing.style.width = "30px"
    cursorRing.style.height = "30px"
  })
})

// Add parallax effect to ambient spheres
document.addEventListener("mousemove", (e) => {
  const sphere1 = document.querySelector(".sphere-1")
  const sphere2 = document.querySelector(".sphere-2")
  const sphere3 = document.querySelector(".sphere-3")

  const x = e.clientX / window.innerWidth
  const y = e.clientY / window.innerHeight

  sphere1.style.transform = `translate(${x * 50}px, ${y * 50}px)`
  sphere2.style.transform = `translate(${-x * 50}px, ${-y * 50}px)`
  sphere3.style.transform = `translate(${x * 30}px, ${-y * 30}px)`
})

