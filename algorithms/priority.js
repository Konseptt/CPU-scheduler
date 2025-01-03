export function calculatePriorityNP(processes) {
    const processQueue = JSON.parse(JSON.stringify(processes));
    let currentTime = 0;
    let completed = 0;
    let timeline = [];

    while (completed < processQueue.length) {
        let availableProcesses = processQueue.filter(p => 
            p.remainingTime > 0 && p.arrivalTime <= currentTime
        );

        if (availableProcesses.length === 0) {
            currentTime++;
            continue;
        }

        let highestPriority = availableProcesses.reduce((prev, curr) => 
            prev.priority < curr.priority ? prev : curr
        );

        if (highestPriority.responseTime === -1) {
            highestPriority.responseTime = currentTime - highestPriority.arrivalTime;
        }

        timeline.push({
            processId: highestPriority.id,
            startTime: currentTime,
            endTime: currentTime + highestPriority.remainingTime
        });

        currentTime += highestPriority.remainingTime;
        highestPriority.remainingTime = 0;
        highestPriority.finishTime = currentTime;
        highestPriority.turnaroundTime = highestPriority.finishTime - highestPriority.arrivalTime;
        highestPriority.waitingTime = highestPriority.turnaroundTime - highestPriority.burstTime;
        completed++;
    }

    return { timeline, processes: processQueue };
}

export function calculatePriorityP(processes) {
    const processQueue = JSON.parse(JSON.stringify(processes));
    let currentTime = 0;
    let completed = 0;
    let timeline = [];
    let currentProcess = null;

    while (completed < processQueue.length) {
        let availableProcesses = processQueue.filter(p => 
            p.remainingTime > 0 && p.arrivalTime <= currentTime
        );

        if (availableProcesses.length === 0) {
            currentTime++;
            continue;
        }

        let highestPriority = availableProcesses.reduce((prev, curr) => 
            prev.priority < curr.priority ? prev : curr
        );

        if (highestPriority.responseTime === -1) {
            highestPriority.responseTime = currentTime - highestPriority.arrivalTime;
        }

        if (currentProcess !== highestPriority) {
            if (currentProcess) {
                timeline.push({
                    processId: currentProcess.id,
                    startTime: currentProcess.startTime,
                    endTime: currentTime
                });
            }
            highestPriority.startTime = currentTime;
            currentProcess = highestPriority;
        }

        highestPriority.remainingTime--;
        currentTime++;

        if (highestPriority.remainingTime === 0) {
            timeline.push({
                processId: highestPriority.id,
                startTime: highestPriority.startTime,
                endTime: currentTime
            });
            highestPriority.finishTime = currentTime;
            highestPriority.turnaroundTime = highestPriority.finishTime - highestPriority.arrivalTime;
            highestPriority.waitingTime = highestPriority.turnaroundTime - highestPriority.burstTime;
            completed++;
            currentProcess = null;
        }
    }

    return { timeline, processes: processQueue };
}
