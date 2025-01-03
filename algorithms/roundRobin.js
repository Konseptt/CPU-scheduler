export function calculateRR(processes, timeQuantum) {
    const processQueue = JSON.parse(JSON.stringify(processes));
    let currentTime = 0;
    let completed = 0;
    let timeline = [];
    let readyQueue = [];

    processQueue.sort((a, b) => a.arrivalTime - b.arrivalTime);
    let currentIndex = 0;

    while (completed < processQueue.length) {
        // Add newly arrived processes to ready queue
        while (currentIndex < processQueue.length && processQueue[currentIndex].arrivalTime <= currentTime) {
            readyQueue.push(processQueue[currentIndex]);
            currentIndex++;
        }

        if (readyQueue.length === 0) {
            currentTime++;
            continue;
        }

        let currentProcess = readyQueue.shift();
        
        if (currentProcess.responseTime === -1) {
            currentProcess.responseTime = currentTime - currentProcess.arrivalTime;
        }

        let executeTime = Math.min(timeQuantum, currentProcess.remainingTime);

        timeline.push({
            processId: currentProcess.id,
            startTime: currentTime,
            endTime: currentTime + executeTime
        });

        currentTime += executeTime;
        currentProcess.remainingTime -= executeTime;

        // Add newly arrived processes during this time quantum
        while (currentIndex < processQueue.length && processQueue[currentIndex].arrivalTime <= currentTime) {
            readyQueue.push(processQueue[currentIndex]);
            currentIndex++;
        }

        if (currentProcess.remainingTime > 0) {
            readyQueue.push(currentProcess);
        } else {
            currentProcess.finishTime = currentTime;
            currentProcess.turnaroundTime = currentProcess.finishTime - currentProcess.arrivalTime;
            currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
            completed++;
        }
    }

    return { timeline, processes: processQueue };
}
