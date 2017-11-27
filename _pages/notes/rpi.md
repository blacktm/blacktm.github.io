---
title: Raspberry Pi
---

<a href="/notes" class="back">← notes</a>

# Raspberry Pi

## Updating

```bash
sudo apt update
sudo apt full-upgrade
```

## SSH

1. Enable SSH in "Preferences > Raspberry Pi Configuration > Interfaces"
2. Get the Pi's IP address by running `hostname -I`
3. From another computer, run:
    ```bash
    ssh pi@<ip address>

    # For example...
    ssh pi@192.168.1.10
    ```

## Image an SD card with an OS image on macOS

Grab OS images from [raspberrypi.org/downloads](http://www.raspberrypi.org/downloads). Detailed installation instructions [are also available](http://www.raspberrypi.org/documentation/installation/installing-images/README.md).

1. Identify the disk (not partition) of the SD card, e.g. `disk4`:
    ```
    diskutil list
    ```
2. Unmount the disk (replace `#` with the disk number):
    ```
    diskutil unmountDisk /dev/disk#
    ```
3. Write the image data to the disk (replace `raspbian.img` with the path of the image):
    ```
    sudo dd bs=1m if=raspbian.img of=/dev/disk#
    ```
    **Warning:** The `dd` process can take a while depending on the speed of your SD card, and there's no output during the copy process.

## Setting up VNC

1. Install the TightVNC package: `sudo apt install tightvncserver`
2. Run `tightvncserver` to choose an access password.
3. Start a VNC server session: `vncserver :0 -geometry 1024x768`
    This uses display zero at resolution 1024 by 768. Read the manual page (`man tightvncserver`) for more options.

Connect via Mac OS:

1. Choose the finder menu, then `Go > Connect to Server...`
2. Enter the server address `vnc://pi@<ip address>:5901`, replacing the `<ip address>` with your Pi's IP address (find it using `hostname -I`).
3. Screen Sharing with prompt for the VNC password chosen above.
4. The Pi's desktop should appear.
