"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Camera, Download, X } from "lucide-react"
import html2canvas from "html2canvas"

export default function AccessPassGenerator() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [membershipType, setMembershipType] = useState("Essential Membership")
  const [membershipLength, setMembershipLength] = useState("1 Month")
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=200&width=200")
  const [parkingBay, setParkingBay] = useState("")
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [downloadImageUrl, setDownloadImageUrl] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isSafari, setIsSafari] = useState(false)
  const passRef = useRef(null)

  // Detect Safari browser on component mount
  useEffect(() => {
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    setIsSafari(isSafariBrowser)
    console.log("Browser detection:", { isSafari: isSafariBrowser, userAgent: navigator.userAgent })
  }, [])

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setProfileImage(event.target.result.toString())
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Generate the pass image and show the download modal
  const generatePass = async () => {
    if (!passRef.current) {
      setErrorMessage("Could not find the pass element to capture.")
      return
    }

    setIsGenerating(true)
    setErrorMessage("")

    try {
      console.log("Starting html2canvas capture...")

      // Special options for Safari
      const options = {
        scale: 2,
        backgroundColor: null,
        logging: true, // Enable logging for debugging
        allowTaint: true, // Allow tainted canvas
        useCORS: true, // Use CORS to handle cross-origin images
        // For Safari, we need to be more permissive with security
        foreignObjectRendering: false, // Disable foreignObject rendering which can cause issues in Safari
      }

      console.log("html2canvas options:", options)

      const canvas = await html2canvas(passRef.current, options)
      console.log("Canvas created successfully")

      const image = canvas.toDataURL("image/png")
      console.log("Image data URL created")

      setDownloadImageUrl(image)
      setShowDownloadModal(true)
    } catch (error) {
      console.error("Error generating image:", error)
      setErrorMessage(`Error generating image: ${error.message || "Unknown error"}`)
      alert("There was an error generating your access pass. Please check the console for details.")
    } finally {
      setIsGenerating(false)
    }
  }

  // Try to download directly (for non-Safari browsers)
  const downloadImage = () => {
    if (!downloadImageUrl) {
      setErrorMessage("No image available to download.")
      return
    }

    const filename = `${firstName || "access"}-${lastName || "pass"}-${Date.now()}.png`

    try {
      // Create a temporary link element
      const link = document.createElement("a")
      link.href = downloadImageUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error downloading:", error)
      setErrorMessage(`Error downloading: ${error.message || "Unknown error"}`)
      // If direct download fails, keep the modal open so user can save manually
    }
  }

  // Alternative method for Safari - open in new window
  const openInNewWindow = () => {
    if (!downloadImageUrl) return

    const newWindow = window.open()
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Access Pass</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; text-align: center; }
              img { max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 4px; }
              .instructions { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 4px; }
            </style>
          </head>
          <body>
            <h2>Your Access Pass</h2>
            <div class="instructions">
              <p><strong>To save this image:</strong></p>
              <p>Press and hold (or right-click) on the image below and select "Save Image"</p>
            </div>
            <img src="${downloadImageUrl}" alt="Access Pass">
          </body>
        </html>
      `)
      newWindow.document.close()
    }
  }

  const getMembershipColor = () => {
    switch (membershipType) {
      case "Premium Membership":
        return "bg-[#E8E4DA] text-gray-800" // Premium is light, so using dark text
      case "Deluxe Membership":
        return "bg-[#3C3B39]"
      case "Parking Membership":
        return "bg-[#8C8884]"
      default:
        return "bg-[#EF4137]"
    }
  }

  const getMembershipLogo = () => {
    switch (membershipType) {
      case "Premium Membership":
        return "/premium-logo.png"
      case "Deluxe Membership":
        return "/deluxe-logo.png"
      case "Parking Membership":
        return "/deluxe-logo.png" // Using the same logo as Deluxe for now
      default:
        return "/essentials-logo.png"
    }
  }

  // Add a new function to get the membership block colors
  const getMembershipBlockStyle = () => {
    switch (membershipType) {
      case "Premium Membership":
        return {
          background: "bg-[#E8E4DA]",
          text: "text-[#3C3B39]",
        }
      case "Deluxe Membership":
        return {
          background: "bg-[#8C8884]",
          text: "text-[#E8E4DA]",
        }
      case "Parking Membership":
        return {
          background: "bg-[#8C8884]",
          text: "text-[#E8E4DA]",
        }
      default:
        return {
          background: "bg-[#ef4238]",
          text: "text-white",
        }
    }
  }

  // Generate ID with CK prefix
  const generateID = () => {
    return "CK" + Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  // Gotham Bold style to be applied to all text
  const gothamBoldStyle = {
    fontFamily: "'Gotham Bold', 'Arial Bold', 'Helvetica Neue', sans-serif",
    fontWeight: 700,
    letterSpacing: "0.02em",
  }

  // Check if parking membership is selected
  const isParkingMembership = membershipType === "Parking Membership"

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          backgroundPosition: "center center",
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">CKClub Pass Generator</h1>
          <p className="mt-3 text-xl text-gray-600">Internal tool for team members to generate member access passes</p>
          {isSafari && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-700">
                <strong>Safari detected:</strong> For best results, please use Chrome or Firefox.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-6">Enter Your Details</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
              <div className="flex items-center justify-center">
                <label className="relative cursor-pointer">
                  <div className="h-40 w-40 rounded-full overflow-hidden border-2 border-gray-300">
                    <Image
                      src={profileImage || "/placeholder.svg"}
                      alt="Profile"
                      width={160}
                      height={160}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter your first name"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter your last name"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Membership Type</label>
              <select
                value={membershipType}
                onChange={(e) => setMembershipType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option>Essential Membership</option>
                <option>Premium Membership</option>
                <option>Deluxe Membership</option>
                <option>Parking Membership</option>
              </select>
            </div>

            {/* Conditional Parking Bay Input - Now above membership length */}
            {isParkingMembership && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Parking Bay Number</label>
                <input
                  type="text"
                  value={parkingBay}
                  onChange={(e) => setParkingBay(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter your parking bay number"
                />
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Membership Length</label>
              <select
                value={membershipLength}
                onChange={(e) => setMembershipLength(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option>1 Month</option>
                <option>6 Months</option>
                <option>12 Months</option>
              </select>
            </div>

            <button
              onClick={generatePass}
              disabled={isGenerating}
              className="w-full bg-[#EF4137] text-white py-2 px-4 rounded-md hover:bg-[#d93a31] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <span className="mr-2">Generating...</span>
                  <span className="animate-spin">⏳</span>
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Generate Access Pass
                </>
              )}
            </button>

            {errorMessage && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {errorMessage}
              </div>
            )}

            {isSafari && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
                <p className="font-medium">Safari Users:</p>
                <p>
                  After clicking "Generate Access Pass", you'll see a preview. Click "Open in New Window" and then save
                  the image from there.
                </p>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="flex items-center justify-center">
            <div
              ref={passRef}
              className="w-full max-w-md aspect-[2/3] rounded-xl overflow-hidden shadow-lg bg-[#3C3B39] relative flex flex-col"
              style={gothamBoldStyle}
            >
              {/* Card Content */}
              <div className="flex flex-col flex-grow relative z-10">
                {/* Header with Logo */}
                <div className={`${getMembershipColor()} flex items-center justify-center py-3 px-4`}>
                  <div className="h-10 md:h-12">
                    <Image
                      src={getMembershipLogo() || "/placeholder.svg"}
                      alt={`${membershipType} Logo`}
                      width={150}
                      height={60}
                      className="h-full w-auto"
                    />
                  </div>
                </div>

                {/* Profile */}
                <div className="flex-grow bg-[#3C3B39] flex flex-col items-center justify-center p-6 text-white relative">
                  {/* Grid Pattern for Card Background - Now contained within the profile section */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 1px, transparent 1px)
                      `,
                      backgroundSize: "40px 40px",
                      backgroundPosition: "center center",
                    }}
                  />

                  <div className="relative z-10">
                    <div className="h-44 w-44 rounded-full overflow-hidden border-4 border-gray-600 mb-6">
                      <Image
                        src={profileImage || "/placeholder.svg"}
                        alt="Profile"
                        width={200}
                        height={200}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="relative z-10 w-full flex flex-col items-center">
                    <h2 className="text-3xl text-white text-center tracking-wide mb-4 uppercase">
                      {firstName || "First"} {lastName || "Last"}
                    </h2>

                    {/* Membership type and month blocks */}
                    <div className="flex flex-col items-center gap-2 w-full">
                      <div
                        className={`${getMembershipBlockStyle().background} h-12 flex items-center justify-center w-full`}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        <h3
                          className={`text-xl ${getMembershipBlockStyle().text} text-center m-0`}
                          style={{ margin: 0, padding: 0 }}
                        >
                          {membershipType || "Essential Membership"}
                        </h3>
                      </div>

                      {/* Parking Bay Number (only shown for Parking Membership) - Now above membership length */}
                      {isParkingMembership && parkingBay && (
                        <div
                          className={`${getMembershipBlockStyle().background} h-12 flex items-center justify-center w-full`}
                          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                          <p
                            className={`text-base ${getMembershipBlockStyle().text} whitespace-nowrap text-center m-0`}
                            style={{ margin: 0, padding: 0 }}
                          >
                            Bay: {parkingBay}
                          </p>
                        </div>
                      )}

                      <div
                        className={`${getMembershipBlockStyle().background} h-12 flex items-center justify-center w-full`}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        <p
                          className={`text-base ${getMembershipBlockStyle().text} whitespace-nowrap text-center m-0`}
                          style={{ margin: 0, padding: 0 }}
                        >
                          {membershipLength}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 w-full relative z-10">
                    <div className="border-t border-gray-600 pt-4">
                      <div className="text-center text-gray-300 text-sm">ID: {generateID()}</div>
                      <div className="text-center text-gray-300 text-sm mt-1">
                        Valid until: {(() => {
                          const today = new Date()
                          const months = Number.parseInt(membershipLength.split(" ")[0])
                          const expiry = new Date(today)
                          expiry.setMonth(today.getMonth() + months)
                          return expiry.toLocaleDateString()
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer - Solid black background */}
              <div className="bg-black text-white h-14 flex items-center justify-center text-sm relative z-20">
                <p className="text-base text-white">CK Club Access Pass</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download Modal - Safari Compatible Solution */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Your Access Pass is Ready</h3>
                <button onClick={() => setShowDownloadModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <div className="text-center mb-6">
                {isSafari ? (
                  <>
                    <p className="text-gray-600 mb-4">
                      <strong>Safari users:</strong> Click the button below to open your pass in a new window, then save
                      it from there.
                    </p>
                    <button
                      onClick={openInNewWindow}
                      className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors mb-6"
                    >
                      Open in New Window
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-600 mb-4">Click the button below to download your access pass.</p>
                    <button
                      onClick={downloadImage}
                      className="bg-[#EF4137] text-white py-2 px-6 rounded-md hover:bg-[#d93a31] transition-colors mb-6"
                    >
                      <Download className="inline mr-2 h-5 w-5" />
                      Download Access Pass
                    </button>
                  </>
                )}
              </div>

              <div className="flex justify-center">
                <div className="border border-gray-300 rounded-lg overflow-hidden shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={downloadImageUrl || "/placeholder.svg"} alt="Access Pass" className="max-w-full h-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
