import axios from 'axios';

const JAVA_KEY = "62"; // Java (OpenJDK 13.0.1)
const JAVASCRIPT_KEY = "63"; // JavaScript (Node.js 12.14.0)
const PYTHON_KEY = "71"; // Python (3.8.1)

const baseUrl = "http://localhost:2358"


const executeCode = async (code, language_id) => {
    const data = {
        source_code: code,
        language_id,
        cpu_time_limit: "2",
        cpu_extra_time: "0.5",
        wall_time_limit: "5",
        memory_limit: "128000",
        stack_limit: "64000",
        max_processes_and_or_threads: "60",
        enable_per_process_and_thread_time_limit: false,
        enable_per_process_and_thread_memory_limit: false,
        max_file_size: "1024",
    }
    const {token} = (await axios.post(`${baseUrl}/submissions/?base64_encoded=false&wait=false`, data)).data;

    setTimeout(() => {}, 3000);

    const result = (await axios.get(`${baseUrl}/submissions/${token}?base64_encoded=false`)).data;

    return result;
}