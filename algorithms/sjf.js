export function calculateSJF(processes) {
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

        let shortestJob = availableProcesses.reduce((prev, curr) => 
            prev.burstTime < curr.burstTime ? prev : curr
        );

        if (shortestJob.startTime === -1) {
            shortestJob.startTime = currentTime;
            shortestJob.responseTime = currentTime - shortestJob.arrivalTime;
        }

        timeline.push({
            processId: shortestJob.id,
            startTime: currentTime,
            endTime: currentTime + shortestJob.burstTime
        });

        currentTime += shortestJob.burstTime;
        shortestJob.remainingTime = 0;
        shortestJob.finishTime = currentTime;
        shortestJob.turnaroundTime = shortestJob.finishTime - shortestJob.arrivalTime;
        shortestJob.waitingTime = shortestJob.turnaroundTime - shortestJob.burstTime;
        completed++;
    }

    return { timeline, processes: processQueue };
}
