from playwright.sync_api import sync_playwright
import os
import glob

def run_cuj(page):
    page.goto("http://localhost:3000")
    # Wait for the preloader to finish and the main content to be visible
    page.wait_for_selector('text=ACCESS GRANTED', state='hidden', timeout=15000)
    page.wait_for_timeout(1000)

    # Scroll down multiple times to simulate the 3-minute scroll issue
    for i in range(10):
        page.mouse.wheel(0, 1000)
        page.wait_for_timeout(500)

    # Take screenshot at the end of the scroll
    os.makedirs("/home/jules/verification/screenshots", exist_ok=True)
    page.screenshot(path="/home/jules/verification/screenshots/verification.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        os.makedirs("/home/jules/verification/videos", exist_ok=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()

        # Find the generated video file
        video_files = glob.glob("/home/jules/verification/videos/*.webm")
        if video_files:
            print(f"Video saved to: {video_files[0]}")
        else:
            print("No video file found.")
