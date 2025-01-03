export function calculateSRTF(processes) {
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
            if (currentProcess) {
                timeline.push({
                    processId: currentProcess.id,
                    startTime: currentProcess.startTime,
                    endTime: currentTime
                });
                currentProcess = null;
            }
            continue;
        }

        let shortestJob = availableProcesses.reduce((prev, curr) => 
            prev.remainingTime < curr.remainingTime ? prev : curr
        );

        if (shortestJob.responseTime === -1) {
            shortestJob.responseTime = currentTime - shortestJob.arrivalTime;
        }

        if (currentProcess !== shortestJob) {
            if (currentProcess) {
                timeline.push({
                    processId: currentProcess.id,
                    startTime: currentProcess.startTime,
                    endTime: currentTime
                });
            }
            shortestJob.startTime = currentTime;
            currentProcess = shortestJob;
        }

        shortestJob.remainingTime--;
        currentTime++;

        if (shortestJob.remainingTime === 0) {
            shortestJob.finishTime = currentTime;
            shortestJob.turnaroundTime = shortestJob.finishTime - shortestJob.arrivalTime;
            shortestJob.waitingTime = shortestJob.turnaroundTime - shortestJob.burstTime;
            completed++;
            currentProcess = null;
        }
    }

    return { timeline, processes: processQueue };
}
