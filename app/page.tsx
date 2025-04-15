"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Camera, Download } from "lucide-react"
import html2canvas from "html2canvas"

export default function AccessPassGenerator() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [membershipType, setMembershipType] = useState("Essential Membership")
  const [membershipLength, setMembershipLength] = useState("1 Month")
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=200&width=200")
  const [parkingBay, setParkingBay] = useState("")
  const passRef = useRef(null)

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

  // Updated download function with Safari compatibility
  const downloadPass = async () => {
    if (!passRef.current) return

    try {
      const canvas = await html2canvas(passRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
      })

      const image = canvas.toDataURL("image/png")

      // Create a filename
      const filename = `${firstName || "access"}-${lastName || "pass"}-${Date.now()}.png`

      // Check if it's Safari
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

      if (isSafari) {
        // Safari approach - open in new tab
        const newTab = window.open()
        if (newTab) {
          newTab.document.write(`
            <html>
              <head>
                <title>Download Access Pass</title>
              </head>
              <body style="margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background-color: #f5f5f5; font-family: Arial, sans-serif;">
                <div style="text-align: center; max-width: 600px; padding: 20px;">
                  <h2 style="margin-bottom: 20px;">Your Access Pass is Ready</h2>
                  <p style="margin-bottom: 30px;">Right-click on the image below and select "Save Image As..." to download your access pass.</p>
                  <img src="${image}" alt="Access Pass" style="max-width: 100%; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
                  <p style="margin-top: 30px; color: #666;">You can close this tab after saving your access pass.</p>
                </div>
              </body>
            </html>
          `)
          newTab.document.close()
        }
      } else {
        // Standard approach for other browsers
        const link = document.createElement("a")
        link.href = image
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error("Error generating image:", error)
      alert("There was an error generating your access pass. Please try again.")
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
              onClick={downloadPass}
              className="w-full bg-[#EF4137] text-white py-2 px-4 rounded-md hover:bg-[#d93a31] transition-colors flex items-center justify-center"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Access Pass
            </button>
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
    </div>
  )
}
