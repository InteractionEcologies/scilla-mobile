#!/bin/bash

./gradlew ${1:-installDevMinSdkDevKernelDebug} --stacktrace && adb shell am start -n com.intecolab.scilla/host.exp.exponent.MainActivity
